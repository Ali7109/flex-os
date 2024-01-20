import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Roboto_Mono } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const robotoMono = Roboto_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "flex-os",
	description: "terminal simulation",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={robotoMono.className}>{children}</body>
		</html>
	);
}
