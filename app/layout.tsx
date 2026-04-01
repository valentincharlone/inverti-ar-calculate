import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "inverti.ar — Comparador de inversiones en Argentina",
  description:
    "Compará plazos fijos, CEDEARs, acciones y bonos. Encontrá el mejor banco o broker para tu inversión en Argentina.",
  keywords: [
    "plazo fijo",
    "CEDEARs",
    "acciones",
    "bonos",
    "broker Argentina",
    "comparador inversiones",
    "mejor tasa plazo fijo",
    "invertir en Argentina",
  ],
  openGraph: {
    title: "inverti.ar — Comparador de inversiones en Argentina",
    description:
      "Compará plazos fijos, CEDEARs, acciones y bonos. Encontrá el mejor banco o broker en segundos.",
    url: "https://inverti.ar",
    siteName: "inverti.ar",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "inverti.ar — Comparador de inversiones en Argentina",
    description:
      "Compará plazos fijos, CEDEARs, acciones y bonos. Encontrá el mejor banco o broker en segundos.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://inverti.ar",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geist.className} bg-slate-950 text-white antialiased min-h-screen`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
