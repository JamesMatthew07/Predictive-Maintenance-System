import type { Metadata } from "next";

import { DemoProvider } from "@/components/providers/demo-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Bridgewater Predictive Maintenance Command Center",
    template: "%s | Bridgewater Command Center",
  },
  description:
    "Bridgewater Interiors predictive maintenance demo spanning Detroit, Warren, Eastaboga, and Lansing with a Warren-first hero story.",
  icons: {
    icon: "/brand/bridgewater-icon-32.png",
    apple: "/brand/bridgewater-icon-180.png",
    shortcut: "/brand/bridgewater-icon-32.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full font-sans">
        <TooltipProvider>
          <DemoProvider>{children}</DemoProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
