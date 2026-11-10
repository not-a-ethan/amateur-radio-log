import type { Metadata, Viewport } from "next";

import { ThemeProvider } from "next-themes";

import { Geist, Geist_Mono } from "next/font/google";

import { Link, Toast } from "@heroui/react";

import { ThemeSwitcher } from "./components/themeSwitcher";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ham Radio Log",
  description: "A radio for contacts you make using ham radio (No the radio is not eatible",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
           {children}
          <Toast.Provider />

          <br />
          
          <footer className="footer">
            <Link href="/">Home</Link> | <Link href="/dashboard">Dashboard</Link> | <Link href="/account">Account</Link> | <Link href="/repeaters">Repeaters</Link> | <Link href="/where">Where</Link> | <Link href="/equipment">Equipment</Link> | <ThemeSwitcher className="inline" />
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
};