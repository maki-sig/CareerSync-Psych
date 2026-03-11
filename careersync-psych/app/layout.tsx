import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google"; 
import "../app/styles/global.css"
import "../app/styles/theme.css"
import "../app/styles/fonts.css"

const spaceGrotesk = Space_Grotesk({
  variable: "--space-grotesk",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerSync",
  description: "v1.0.1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${spaceGrotesk.variable} ${plusJakarta.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}