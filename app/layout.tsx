import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Variable weight (200-800) powers the hero's weight-on-hover effect; opsz keeps big sizes crisp.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Taimoor Alam | Shopify Plus Developer & CRO Specialist",
  description:
    "Shopify Plus developer and CRO specialist. Custom OS 2.0 themes, checkout extensions, Shopify Functions, subscriptions and A/B tests that lifted revenue per visitor by 41%.",
  keywords: [
    "Shopify Plus developer",
    "Shopify developer",
    "CRO specialist",
    "A/B testing",
    "Intelligems",
    "Shopify Functions",
    "Checkout extensions",
    "Recharge",
    "Liquid",
  ],
  authors: [{ name: "Taimoor Alam" }],
  openGraph: {
    title: "Taimoor Alam | Shopify Plus Developer & CRO Specialist",
    description: "Shopify Plus stores that convert. A/B tested, built by hand, shipped.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#060608",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} ${instrument.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
