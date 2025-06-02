"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const isHomeOrSignup = pathname === "/" || pathname === "/signup";

  if (!isHomeOrSignup) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">
              10000x Devs
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors duration-200 ${pathname === "/"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Home
            </Link>
            <Link
              href="/signup"
              className={`text-sm font-medium transition-colors duration-200 ${pathname === "/signup"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Sign Up
            </Link>
          </div>

          {/* Sign In Button */}
          <div className="flex items-center">
            <Link
              href="/signup"
              className="inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-muted/50 hover:bg-muted transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
