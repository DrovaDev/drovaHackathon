import type { Metadata } from "next";
// import { Onest} from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/providers/query-provider";

export const metadata: Metadata = {
	title: "Drova app",
	description:
		"Drova gives your courier company a branded storefront, smart dashboard, P2P-secured payments, and real-time rider tracking — with zero technical setup required.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0"
				/>
			</head>

			<body className="antialiased">
				<TooltipProvider>
					<QueryProvider>{children}</QueryProvider>
				</TooltipProvider>
				<Toaster position="top-right" richColors />
			</body>
		</html>
	);
}
