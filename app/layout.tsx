import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { ToastProvider } from "@/components/providers/toaster-provider"
import { ConfettiProvider } from "@/components/providers/confetti-provider"
import { Theme } from "@radix-ui/themes"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "SkillSynth",
	description: "AI driven, Interactive personalized Education platform",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<ClerkProvider>
			<html lang="en">
				<Theme appearance="dark">
					<body className={inter.className}>
						<ConfettiProvider />
						<ToastProvider />
						{children}
					</body>
				</Theme>
			</html>
		</ClerkProvider>
	)
}
