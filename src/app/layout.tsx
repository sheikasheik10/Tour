import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Instrument_Sans, Noto_Serif_Sinhala } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
  display: "swap",
});
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });
const sinhala = Noto_Serif_Sinhala({ subsets: ["sinhala"], weight: ["400", "600"], variable: "--font-sinhala", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Serendib — Island journeys & stays in Sri Lanka", template: "%s · Serendib" },
  description:
    "Book handpicked stays, guided experiences and made-to-measure journeys across Sri Lanka, from Lion Rock to the leopards of Yala.",
};

export const viewport: Viewport = { themeColor: "#17201a" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${instrument.variable} ${plexMono.variable} ${sinhala.variable}`}>
      <body className="grain">
        <SmoothScroll />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
