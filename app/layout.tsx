import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Rubik } from 'next/font/google';
// import { Providers } from "./providers";

export const metadata: Metadata = {
	title: "uLearn",
	description:
		"An adaptive learning tool that uses IRT to personalize quizzes to individual students.",
};

const rubik = Rubik({ subsets: ['latin'] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.ico" />
				<link rel="icon" sizes="16x16" href="/favicon-16x16.png" />
				<link rel="icon" sizes="32x32" href="/favicon-32x32.png" />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link rel="manifest" href="/manifest.ts" />
				<link rel="icon" href="/favicon.ico?v=2" />
			</head>
			<body className={`${rubik.className} w-screen h-screen max-h-screen overflow-hidden`}>
				{children}
				{/*HANDLES THE TOAST MESSAGE*/}
				{/* <Toaster /> */}
			</body>
		</html>
	);
}
