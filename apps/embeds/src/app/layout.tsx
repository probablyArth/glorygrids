import "~/styles/globals.css";

import { cn } from "~/lib/utils";

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Embed by glorygrids",
  description: "Embed by glorygrids",
  icons: [{ rel: "icon", url: "/gg.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn("min-h-screen bg-background font-sans antialiased")}
    >
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
