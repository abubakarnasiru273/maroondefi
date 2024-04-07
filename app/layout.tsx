import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


// providers

import { Providers} from "./provider/themeprovider";


export const metadata: Metadata = {
  title: "Maroon",
  description: "Self custodian assets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
   <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
