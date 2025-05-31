import Link from "next/link";
import { Github, Home, LayoutDashboard, FolderGit2 } from "lucide-react";
import { Bricolage_Grotesque, Outfit } from "next/font/google";
import { Button } from "@/components/ui/button";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { DotsBackground } from "@/components/dots";

const font = Bricolage_Grotesque({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeAI - Ship Code 10x Faster",
  description:
    "AI-powered development tools that eliminate bugs, automate workflows, and accelerate your entire software development lifecycle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased min-h-screen  ${outfit.className}`}>
        <DotsBackground>
          <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center mx-auto px-5">
              <Link href="/" className="flex items-center space-x-2">
                <Github className="h-6 w-6" />
                <span className="font-bold">DevAI</span>
              </Link>
              <div className="flex items-center space-x-4 ml-auto">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Button>
                </Link>

                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <FolderGit2 className="h-4 w-4 mr-2" />
                    Your Projects
                  </Button>
                </Link>
              </div>
            </div>
          </nav>
          <main className="container pt-16 mx-auto px-4">{children}</main>
        </DotsBackground>
      </body>
    </html>
  );
}
