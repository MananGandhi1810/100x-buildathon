import { Inter, Playfair } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata = {
  title: "Adeon",
  description: "For Developers, by Developers", 
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}
