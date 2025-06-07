"use client";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/magicui/magic-card";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const features = [
  {
    id: 7,
    title: "Automated Testing",
    description:
      "AI-generated test suites with edge case detection, performance testing, and coverage optimization.",
    gradientFrom: "#A07CFE",
    gradientTo: "#FE8FB5",
  },
  {
    id: 5,
    title: "Deploy with Chat",
    description:
      "Conversational deployment pipeline that handles CI/CD, environment setup, and monitoring configuration.",
    gradientFrom: "#6EE7B7",
    gradientTo: "#3B82F6",
  },
  {
    id: 3,
    title: "Vulnerability Scanner",
    description:
      "Advanced security scanning that identifies vulnerabilities, OWASP compliance issues, and suggests fixes.",
    gradientFrom: "#FDE68A",
    gradientTo: "#FCA5A5",
  },
];

type HeroParallaxSectionProps = {
  refObj: React.RefObject<HTMLDivElement | null>;
  parallaxX: any;
  parallaxY: any;
  handleMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: () => void;
};

function HeroParallaxSection({
  refObj,
  parallaxX,
  parallaxY,
  handleMouseMove,
  handleMouseLeave,
}: HeroParallaxSectionProps) {
  return (
    <div
      ref={refObj}
      className="relative z-10 flex flex-col items-center justify-center gap-10 text-center bg-white h-[calc(100vh-6rem)] px-4 md:px-6 py-12 rounded-[2rem] md:rounded-[4rem] overflow-hidden mt-5 max-w-[1920px] max-h-[1080px] mx-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.img
        src="/bg.png"
        className="absolute inset-0 object-cover w-full h-full -z-20"
        style={{ x: parallaxX, y: parallaxY, scale: 1.1 }}
      />
      <div className="absolute inset-0 bg-black/50 -z-10" />
      <div className="absolute bottom-8 right-8 hidden md:flex items-end justify-end w-auto max-w-xl text-right">
        <div>
          <h1 className="text-8xl md:text-[10rem] font-semibold text-white mb-4 drop-shadow-2xl tracking-tighter">
            Zen.
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl drop-shadow-lg font-serif">
            This is what it feels like detaching from the clutter and experience
            true dev experience
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 hidden md:block max-w-md text-left">
        <p className="font-serif text-white/90 text-lg md:text-xl leading-relaxed drop-shadow-md">
          Our product helps developers write, review, and ship better code with
          AI-powered tools. Get instant code reviews, automated testing, and
          intelligent suggestions.
        </p>
        <button className="mt-6 px-10 py-4 rounded-full bg-white text-black text-lg font-semibold shadow-lg transition hover:bg-gray-100">
          Get Started Now
        </button>
      </div>

      {/* Mobile view fallback */}
      <div className="md:hidden flex flex-col gap-4 text-white items-center text-center">
        <h1 className="text-6xl font-semibold tracking-tight">Zen.</h1>
        <p className="text-base px-4">
          This is what it feels like detaching from the clutter and experiencing
          true dev experience.
        </p>
        <p className="text-sm px-4">
          Our product helps developers write, review, and ship better code with
          AI-powered tools. Get instant code reviews, automated testing, and
          intelligent suggestions.
        </p>
        <button className="mt-4 px-6 py-3 rounded-full bg-white text-black text-base font-semibold shadow-md transition hover:bg-gray-100">
          Get Started
        </button>
      </div>
    </div>
  );
}

function FeaturesSection({
  features,
}: {
  features: {
    id: number;
    title: string;
    description: string;
    gradientFrom: string;
    gradientTo: string;
  }[];
}) {
  return (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 py-12 w-full">
      {features.map((f) => (
        <MagicCard
          key={f.id}
          className="group relative overflow-hidden rounded-2xl shadow-xl"
          gradientFrom={f.gradientFrom}
          gradientTo={f.gradientTo}
          gradientOpacity={0.8}
          gradientSize={300}
        >
          <div className="h-[34rem] flex flex-col justify-between">
            <CardHeader className="p-6 z-10 space-y-5">
              <CardTitle className="text-xl md:text-4xl text-white">
                {f.title}
              </CardTitle>
              <CardDescription className="text-sm md:text-lg text-white/80">
                {f.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative h-60">
              <img
                src="/bg.png"
                alt={f.title}
                className="object-cover rounded-b-2xl aspect-video rotate-90 w-full"
              />
            </CardContent>
          </div>
        </MagicCard>
      ))}
    </section>
  );
}

function DescriptionBlock() {
  return (
    <div className="flex flex-col md:flex-row items-start justify-between w-full gap-8">
      <div>
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-semibold text-white mb-4 tracking-tighter">
          Developer Tools are
          <br /> a mess, let's fix that
        </h1>
        <p className="font-serif text-lg md:text-xl text-left max-w-3xl">
          Where developers can focus on what matters most: writing great code,
          shipping it, and getting it to market.
        </p>
      </div>
      <button className="mt-4 md:mt-6 px-8 py-3 md:px-10 md:py-4 rounded-full bg-white text-black text-base md:text-lg font-semibold shadow-lg transition hover:bg-gray-100">
        See More Features!
      </button>
    </div>
  );
}

export default function Home() {
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
    <>
      <Navbar />
      <section className="min-h-screen bgg w-full px-4 md:px-10 pt-16 overflow-hidden space-y-32">
        <HeroParallaxSection
          refObj={ref}
          parallaxX={parallaxX}
          parallaxY={parallaxY}
          handleMouseMove={handleMouseMove}
          handleMouseLeave={handleMouseLeave}
        />
        <div className="relative z-10 flex flex-col gap-10 text-left h-full max-h-[1080px] max-w-[1920px] mx-auto">
          <DescriptionBlock />
          <FeaturesSection features={features} />
        </div>
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative z-10  my-12 rounded-2xl md:rounded-[2rem] overflow-hidden w-full bg-black py-20 px-6 text-white text-center flex flex-col items-center justify-center max-w-[1920px] mx-auto"
        >
          <motion.img
            src="/cta.png"
            className="absolute inset-0 object-cover w-full h-full -z-20"
            style={{ x: parallaxX, y: parallaxY, scale: 1.1 }}
            alt="CTA Background"
          />
          <div className="absolute inset-0 bg-black/60 -z-10" />
          <h2 className="text-4xl md:text-6xl font-semibold mb-6">
            We’re developers. We get you.
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            Got questions? Need help with your dev workflow? Don’t hesitate —
            reach out and we’ll get you started.
          </p>
        <button className="mt-4 px-6 py-3 rounded-full bg-white text-black text-base font-semibold shadow-md transition hover:bg-gray-100">
            Contact Us
          </button>
        </div>
      </section>
    </>
  );
}
