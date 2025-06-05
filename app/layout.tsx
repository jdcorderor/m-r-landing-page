import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], preload: true });

export const metadata: Metadata = {
  title: "Mavarez & Román",
  description: "Mavarez & Román - Clínica odontológica.",
  openGraph: {
    title: "Mavarez & Román",
    description: "Mavarez & Román - Clínica odontológica.",
    url: "https://mavarezroman.com",
    siteName: "Mavarez & Román",
    images: [
      {
        url: "https://mavarezroman.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mavarez & Román - Clínica odontológica.",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
