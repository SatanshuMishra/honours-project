import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "uLearn | Adaptive Learning Tool",
		short_name: "uLearn",
		description:
			"An adaptive learning tool that uses IRT to personalize quizzes to individual students.",
		start_url: "/",
		display: "standalone",
		background_color: "#fff",
		theme_color: "#fff",
		icons: [
			{
				src: "./public/favicon.ico",
				sizes: "any",
				type: "image/x-icon",
			},
		],
	};
}
