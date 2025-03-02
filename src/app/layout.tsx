import React from 'react';
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: "Аналитический ИИ агент | Институт Парламентаризма РК",
  description: "Система аналитических исследований",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${spaceGrotesk.variable}`}>
      <head>
        <title>AI Research Assistant</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          
          {children}
        </div>
      </body>
    </html>
  );
} 