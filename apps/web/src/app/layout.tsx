import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const viewport: Viewport = {
	themeColor: "#F59E0B",
};

export const metadata: Metadata = {
	metadataBase: new URL(env.NEXT_PUBLIC_URL),
	title: {
		default: "Assembly Line",
		template: "%s · Assembly Line",
	},
	description:
		"A free browser-based incremental idle game. Build machines, automate production, and prestige your way to the top.",
	icons: {
		icon: [
			{ url: "/favicons/favicon.ico", sizes: "any" },
			{ url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
		],
		apple: "/favicons/apple-touch-icon.png",
	},
	manifest: "/favicons/manifest.json",
	openGraph: {
		type: "website",
		siteName: "Assembly Line",
		locale: "en_US",
		title: "Assembly Line - Build the Ultimate Automated Factory",
		description:
			"A free browser-based incremental idle game. Build machines, automate production, and prestige your way to the top.",
		images: [
			{
				url: "/api/og/default",
				width: 1200,
				height: 630,
				alt: "Assembly Line – isometric factory floor with conveyor belts and machines",
			},
		],
		url: env.NEXT_PUBLIC_URL,
	},
	twitter: {
		card: "summary_large_image",
		title: "Assembly Line - Build the Ultimate Automated Factory",
		description:
			"A free browser-based incremental idle game. Build machines, automate production, and prestige your way to the top.",
		images: ["/api/og/default"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
				suppressHydrationWarning
			>
				<TRPCReactProvider>
					{children}
					<Toaster />
				</TRPCReactProvider>
			</body>
		</html>
	);
}
