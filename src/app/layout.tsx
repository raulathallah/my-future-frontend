import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ChakraProvider } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "My Future",
    template: "%s | To Do List App",
  },
  description: "My Future Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{ padding: "100px", textAlign: "center" }}
      >
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  );
}
