import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";

import "./globals.css";
import { ReduxProvider } from "@/StateManagement/provider";

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
			<body className={robotoMono.className}>
				<ReduxProvider children={children}></ReduxProvider>
			</body>
		</html>
	);
}
