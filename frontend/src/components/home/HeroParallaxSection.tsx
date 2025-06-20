"use client";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MagicCard } from "@/components/magicui/magic-card";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { submitEmail } from "@/action/waitlist";

type HeroParallaxSectionProps = {
  refObj: React.RefObject<HTMLDivElement | null>;
  parallaxX: any;
  parallaxY: any;
  handleMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: () => void;
};

export default function HeroParallaxSection({
  refObj,
  parallaxX,
  parallaxY,
  handleMouseMove,
  handleMouseLeave,
}: HeroParallaxSectionProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitEmail(email);
      if (result.success) {
        setSubmitSuccess(true);
        setEmail("");
      } else {
        setError(result.error || "Failed to submit email");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartTrialClick = () => {
    router.push("/waitlist");
  };

  return (
    <motion.div
      ref={refObj}
      className="relative z-10 flex flex-col items-center justify-center gap-10 text-center bg-white h-[calc(100vh-6rem)] px-4 py-12 rounded-[2rem] overflow-hidden mt-8 w-full max-w-[2160px] max-h-[800px] mx-auto shadow-2xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      viewport={{ once: true }}
    >
      <motion.img
        src="/bg.png"
        className="absolute inset-0 object-cover w-full h-full -z-20"
        style={{ x: parallaxX, y: parallaxY, scale: 1.05 }}
      />
      <div className="absolute inset-0 bg-black/70 -z-10" />
      <motion.div
        className="absolute bottom-12 right-12 hidden md:flex items-end justify-end w-auto max-w-xl text-right"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
        viewport={{ once: true }}
      >
        <div>
          <h1 className="text-7xl md:text-[8rem] lg:text-[10rem] font-bold text-white mb-6 drop-shadow-2xl tracking-tighter leading-none">
            adeon
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-md drop-shadow-lg font-light leading-relaxed">
            Experience true development flow. Where complexity becomes clarity,
            and shipping becomes effortless.
          </p>
        </div>
      </motion.div>
      <motion.div
        className="absolute bottom-12 left-12 hidden md:block max-w-sm text-left"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
        viewport={{ once: true }}
      >
        {" "}
        <div className=" p-6">
          <p className="text-white/90 text-base leading-relaxed mb-6 font-light">
            The all-in-one developer experience platform that transforms how you
            write, review, and ship code. AI-powered tools that actually
            understand your workflow.
          </p>
          {submitSuccess ? (
            <div className="text-center py-4">
              <p className="text-green-400 text-sm mb-4">
                ✓ Thank you! You've been added to our waitlist.
              </p>
              <button
                onClick={handleStartTrialClick}
                className="px-8 py-3 rounded-full bg-white text-black text-base font-semibold shadow-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-xl transform hover:scale-105"
              >
                Start Free Trial
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 min-w-[300px] sm:min-w-[350px] h-14 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 text-lg"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
                  className="px-8 py-3 rounded-full bg-white text-black text-base font-semibold shadow-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-xl transform hover:scale-105 disabled:opacity-50 whitespace-nowrap"
                >
                  {isSubmitting ? "Joining..." : "Join Waitlist"}
                </button>
              </div>
              {error && <p className="text-red-300 text-sm">{error}</p>}
            </form>
          )}
        </div>
      </motion.div>{" "}
      {/* Mobile view */}
      <motion.div
        className="md:hidden flex flex-col gap-6 text-white items-center text-center max-w-sm mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
        viewport={{ once: true }}
      >
        <h1 className="text-5xl font-bold tracking-tight">adeon</h1>{" "}
        <div className=" p-6 ">
          <p className="text-sm mb-4 font-light leading-relaxed">
            Experience true development flow. Where complexity becomes clarity.
          </p>
          <p className="text-xs mb-6 font-light opacity-90">
            The all-in-one developer experience platform with AI-powered tools.
          </p>
          {submitSuccess ? (
            <div className="text-center space-y-4">
              <p className="text-green-400 text-sm">
                ✓ Thank you! You've been added to our waitlist.
              </p>
              <button
                onClick={handleStartTrialClick}
                className="px-6 py-3 rounded-full bg-white text-black text-sm font-semibold shadow-lg transition-all duration-300 w-full"
              >
                Start Free Trial
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-w-[280px] h-14 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 text-lg"
                required
              />
              {error && <p className="text-red-300 text-xs">{error}</p>}
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
                  className="px-6 py-3 rounded-full bg-white text-black text-sm font-semibold shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? "Joining..." : "Join Waitlist"}
                </button>
                <button
                  type="button"
                  onClick={handleStartTrialClick}
                  className="px-6 py-3 rounded-full border border-white/30 text-white text-sm font-medium transition-all duration-300"
                >
                  Start Free Trial
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
