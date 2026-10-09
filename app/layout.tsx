import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calculadora NSL",
  description: "Calculadora de médias trimestral, de recuperação e final.",
  icons: {
    icon: "/logo_lourdinasTransparente.png",
    shortcut: "/logo_lourdinasTransparente.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
