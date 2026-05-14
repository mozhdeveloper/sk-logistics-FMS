import type { Metadata, Viewport } from "next";
import { Inter, Roboto, Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["600", "700", "800", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#D31A21" },
    { media: "(prefers-color-scheme: dark)",  color: "#A8141A" },
  ],
};

export const metadata: Metadata = {
  title: "SK Logistics Services — Fleet, Trip & Payroll Management",
  description:
    "Premium logistics, fleet, dispatch, GPS tracking, payroll and analytics platform by SK Logistics Services.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "SK Logistics Services",
    description: "Enterprise Fleet & Trip Management by SK Logistics Services",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const ui = JSON.parse(localStorage.getItem('skl-ui') || '{}');
                if (ui?.state?.darkMode) document.documentElement.classList.add('dark');
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="font-sans">
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              borderRadius: "12px",
              fontFamily: "var(--font-roboto)",
            },
          }}
        />
      </body>
    </html>
  );
}
