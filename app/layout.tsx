import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";

const AppFont = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-app",
});

export const metadata: Metadata = {
  title: "Web Tracker",
  description: "Track Website Analytics",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <script
            defer
            data-website-id="256d3e01-99ae-4bc0-a3d7-a9df38708096"
            data-domain="https://localhost:3000"
            src="http://localhost:3000/analytics.js">
          </script>
        </head>

        <body className={AppFont.className}>
          <Provider>{children}</Provider>
          <Toaster position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}