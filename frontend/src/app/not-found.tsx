"use client";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  const parallaxX = useTransform(springX, [-0.5, 0.5], [20, -20]);
  const parallaxY = useTransform(springY, [-0.5, 0.5], [20, -20]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (event.clientX - centerX) / rect.width;
    const y = (event.clientY - centerY) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={ref}
      className="relative z-10 flex flex-col items-center justify-center gap-10 text-center bg-white h-screen px-4 md:px-6 py-12 overflow-hidden max-w-[1920px] max-h-[1080px] mx-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background image with parallax */}
      <motion.img
        src="/404.png"
        className="absolute inset-0 object-cover w-full h-full -z-20"
        style={{ x: parallaxX, y: parallaxY, scale: 1.1 }}
        alt="404 Background"
      />
      <div className="absolute inset-0 bg-black/50 -z-10" />

      {/* Main 404 content - positioned like hero title */}
      <div className="absolute bottom-8 right-8 hidden md:flex items-end justify-end w-auto max-w-xl text-right">
        <div>
          <h1 className="text-8xl md:text-[10rem] font-semibold text-white mb-4 drop-shadow-2xl tracking-tighter">
            404
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-sm drop-shadow-lg font-serif ">
            Page Not Found - You seem to have wandered off the path
          </p>
        </div>
      </div>

      {/* Description and CTA - positioned like hero description */}
      <div className="absolute bottom-8 left-8 hidden md:block max-w-md text-left">
        <p className="font-serif text-white/90 text-lg md:text-xl leading-relaxed drop-shadow-md">
          The page you're looking for doesn't exist or has been moved. Don't
          worry, you can easily navigate back to our main site and continue
          exploring our tools.
        </p>
        <Button
          asChild
          className="mt-6 px-10 py-4 rounded-full bg-white text-black text-lg font-semibold shadow-lg transition hover:bg-gray-100"
        >
          <Link href="/">Return Home</Link>
        </Button>
      </div>

      {/* Mobile view fallback */}
      <div className="md:hidden flex flex-col gap-4 text-white items-center text-center">
        <h1 className="text-6xl font-semibold tracking-tight drop-shadow-2xl">
          404
        </h1>
        <p className="text-base px-4 drop-shadow-lg">
          Page Not Found - You seem to have wandered off the path.
        </p>
        <p className="text-sm px-4 drop-shadow-md ">
          The page you're looking for doesn't exist or has been moved. Don't
          worry, you can easily navigate back to our main site.
        </p>
        <Button
          asChild
          className="mt-4 px-6 py-3 rounded-full bg-white text-black text-base font-semibold shadow-md transition hover:bg-gray-100"
        >
          <Link href="/">Return Home</Link>
        </Button>
      </div>

      {/* Decorative elements - subtle glows like in hero */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-pulse z-10" />
      <div className="absolute top-40 right-32 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000 z-10" />
      <div className="absolute bottom-32 left-16 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-500 z-10" />
    </div>
  );
}
