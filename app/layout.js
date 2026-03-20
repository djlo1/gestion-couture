import "./globals.css";

export const metadata = {
  title: "Couture Pro",
  description: "Gestion d'atelier de couture",
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <link rel="apple-touch-icon" href="https://cdn-icons-png.flaticon.com/512/3063/3063822.png"></link>
      </head>
      <body>{children}</body>
    </html>
  );
}
