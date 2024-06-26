import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import { BotpressProvider } from "@/components/providers/botpress-provider";
import Providers from "@/components/progress-bar-provider";
import TanStackProviders from "./provider";
import Provider from "./_trpc/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillSynth - AI driven, Interactive personalized Education platform",
  description: "SkillSynth - AI driven, Interactive personalized Education platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <BotpressProvider />
        </head>
        <body className={inter.className}>
          <Provider>
            <TanStackProviders>
              <ConfettiProvider />
              <ToastProvider />
              <Providers>{children}</Providers>
            </TanStackProviders>
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
