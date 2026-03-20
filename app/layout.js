import "./globals.css";

export const metadata = {
  title: "Couture Pro",
  description: "Mon Atelier de Couture",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
      </head>
      <body style={{ margin: 0, backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
