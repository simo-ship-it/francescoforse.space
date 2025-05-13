import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
   title: 'francescoforse – 3D Portfolio',
  description: 'Modelli 3D interattivi e progetti di visual design.',
  keywords: ['3D', 'WebGL', 'Three.js', 'Portfolio'],
  authors: [{ name: 'Francesco Forse', url: 'https://www.francescoforse.space' }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
