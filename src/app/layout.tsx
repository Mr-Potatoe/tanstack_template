import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TanstackProvider from "../provider/tanstack-provider";
import { ThemeProvider } from "@/provider/theme-provider";
import { FloatingCredits } from "@/components/credits/FloatingCredits";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "TanStack React Query Template";
const description =
  "A reusable Next.js + TanStack starter with batteries-included theming, data fetching, and offline-ready PWA defaults.";

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  applicationName: "TanStack PWA Template",
  manifest: "/manifest.webmanifest",
  keywords: [
    "Next.js",
    "TanStack Query",
    "React",
    "Template",
    "PWA",
    "Offline",
  ],
  authors: [{ name: "TanStack Template" }],
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png" }],
    shortcut: [{ url: "/icons/icon-192.png" }],
  },
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
  openGraph: {
    title,
    description,
    url: "https://tanstack-template.local",
    siteName: "TanStack PWA Template",
    images: [
      {
        url: "/icons/icon-512.png",
        width: 512,
        height: 512,
        alt: title,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [
      {
        url: "/icons/icon-512.png",
        alt: title,
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TanstackProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <FloatingCredits />
          </ThemeProvider>
          <ServiceWorkerRegister />
        </TanstackProvider>
      </body>
    </html>
  );
}
