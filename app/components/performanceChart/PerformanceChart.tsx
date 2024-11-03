"use client"
import { useState, useEffect } from 'react';
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A multiple line chart"

const chartConfig = {
	'recursion': {
		label: "Recursion",
		color: "hsl(var(--chart-1))",
	},
	'lists-queues-and-stacks': {
		label: "Lists, Queues, and Stacks",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

export default function PerfomanceChart() {

	const [data, setData] = useState();

	useEffect(() => {
		fetchChartData();
	}, [])

	const fetchChartData = async () => {
		try {
			const response = await fetch('./dashboard/api/fetchChartPerformanceData/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ studentId: "3d9bb8f4-5c9e-4902-96d9-ca6e029565c6" }),
			});
			const result = await response.json();
			if (result.status !== 200 || !result.data) {
				throw new Error('Failed to fetch performance data');
			}
			console.log(result);
			setData(result.data);
		} catch (err) {
			console.log(err);
		};
	}

	return (
		<div className='flex-1 py-4'>
			<Card>
				<CardHeader>
					<CardDescription>Your recent performance trends for each topics.</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer config={chartConfig}>
						<LineChart
							accessibilityLayer
							data={data}
							margin={{
								left: 12,
								right: 12,
								top: 12,
								bottom: 12
							}}
						>
							<CartesianGrid vertical={false} />
							<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
							<Line
								dataKey="recursion"
								type="monotone"
								stroke="var(--color-recursion)"
								strokeWidth={2}
								dot={{
									fill: "var(--color-recursion)",
								}}
							/>
							<Line
								dataKey="lists-queues-and-stacks"
								type="monotone"
								stroke="var(--color-lists-queues-and-stacks)"
								strokeWidth={2}
								dot={{
									fill: "var(--color-lists-queues-and-stacks)",
								}}

							/>
						</LineChart>
					</ChartContainer>
				</CardContent>
				<CardFooter>
					<div className="flex w-full items-start gap-2 text-sm">
						<div className="grid gap-2">
							<div className="flex items-center gap-2 font-medium leading-none">
							</div>
							<div className="flex items-center gap-2 leading-none text-muted-foreground">
							</div>
						</div>
					</div>
				</CardFooter>
			</Card>
		</div>
	)
}
