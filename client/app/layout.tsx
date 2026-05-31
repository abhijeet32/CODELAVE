import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, JetBrains_Mono, Public_Sans, Libre_Caslon_Display } from 'next/font/google';
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-navbar',
});

const libreCaslon = Libre_Caslon_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-hero-heading',
});

export const metadata: Metadata = {
  title: "Codelave - Managed Code Execution",
  description: "The ultimate platform for secure, scalable, and instant code execution environments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} ${publicSans.variable} ${libreCaslon.variable} antialiased overflow-x-hidden bg-[#070707]`}
      >
        {children}
      </body>
    </html>
  );
}
