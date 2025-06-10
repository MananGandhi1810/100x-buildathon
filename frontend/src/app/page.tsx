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
    <motion.div
      ref={refObj}
      className="relative z-10 flex flex-col items-center justify-center gap-10 text-center bg-white h-[calc(100vh-6rem)] px-4 md:px-6 py-12 rounded-[2rem] md:rounded-[4rem] overflow-hidden mt-5 max-w-[1400px] max-h-[800px] mx-auto"
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
        style={{ x: parallaxX, y: parallaxY, scale: 1.1 }}
      />
      <div className="absolute inset-0 bg-black/50 -z-10" />

      <motion.div
        className="absolute bottom-8 right-8 hidden md:flex items-end justify-end w-auto max-w-lg text-right"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
        viewport={{ once: true }}
      >
        <div>
          <h1 className="text-8xl md:text-[10rem] font-semibold text-white mb-4 drop-shadow-2xl tracking-tighter">
            Zen.
          </h1>
          <p className="text-lg text-white/90 max-w-2xl drop-shadow-lg font-mono">
            This is what it feels like detaching from the clutter and experience
            true dev experience
          </p>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-8 hidden md:block max-w-xs text-left"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
        viewport={{ once: true }}
      >
        <p className="font-mono text-white/80 text-base leading-relaxed drop-shadow-md">
          Our product helps developers write, review, and ship better code with
          AI-powered tools. Get instant code reviews, automated testing, and
          intelligent suggestions.
        </p>
        <button className="mt-6 px-8 py-3 rounded-full bg-white text-black text-base font-semibold shadow-lg transition hover:bg-gray-100">
          Get Started Now
        </button>
      </motion.div>

      {/* Mobile view fallback */}
      <motion.div
        className="md:hidden flex flex-col gap-4 text-white items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
        viewport={{ once: true }}
      >
        <h1 className="text-6xl font-semibold tracking-tight">Zen.</h1>
        <p className="text-sm px-4 font-mono">
          This is what it feels like detaching from the clutter and experiencing
          true dev experience.
        </p>
        <p className="text-xs px-4 font-mono">
          Our product helps developers write, review, and ship better code with
          AI-powered tools. Get instant code reviews, automated testing, and
          intelligent suggestions.
        </p>
        <button className="mt-4 px-8 py-3 rounded-full bg-white text-black text-sm font-semibold shadow-md transition hover:bg-gray-100">
          Get Started Now
        </button>
      </motion.div>
    </motion.div>
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
      {features.map((f, index) => (
        <motion.div
          key={f.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          <MagicCard
            className="group relative overflow-hidden rounded-2xl shadow-xl h-full"
            gradientFrom={f.gradientFrom}
            gradientTo={f.gradientTo}
            gradientOpacity={0.8}
            gradientSize={300}
          >
            <div className="h-[28rem] flex flex-col justify-between">
              <CardHeader className="p-5 z-10 space-y-4">
                <CardTitle className="text-lg md:text-2xl text-white">
                  {f.title}
                </CardTitle>
                <CardDescription className="text-xs md:text-base text-white/80">
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
        </motion.div>
      ))}
    </section>
  );
}

function DescriptionBlock() {
  return (
    <motion.div
      className="flex flex-col md:flex-row items-start justify-between w-full gap-8 mb-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      viewport={{ once: true }}
    >
      <div>
        <motion.div
          className="inline-block mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-mono">
            {"// SOLUTION_FEATURES"}
          </span>
        </motion.div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6 tracking-tighter leading-tight">
          So how do we fix this mess?
        </h1>
        <p className="font-mono text-base md:text-lg text-white/70 max-w-2xl leading-relaxed">
          Where developers can focus on what matters most: writing great code,
          shipping it, and getting it to market.
        </p>
      </div>
      <button className="mt-6 px-8 py-3 rounded-full bg-white text-black text-base font-semibold shadow-lg transition hover:bg-gray-100 whitespace-nowrap">
        See More Features
      </button>
    </motion.div>
  );
}

function ProblemSection({
  parallaxX,
  parallaxY,
  handleMouseMove,
  handleMouseLeave,
}: {
  parallaxX: any;
  parallaxY: any;
  handleMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: () => void;
}) {
  return (
    <motion.div
      className="relative my-24 w-full max-w-[1400px] mx-auto px-5 md:px-10"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      viewport={{ once: true }}
    >
      <div className="bg-[#0f1013] border border-[#3f4042] rounded-2xl p-8 md:p-12">
        {/* Simple geometric accent */}
        <div className="absolute top-8 right-8 w-2 h-2 bg-white rounded-full opacity-60" />

        <div className="max-w-4xl">
          <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-mono">
            {"// DEVELOPER_PROBLEMS"}
          </span>
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-semibold my-8 tracking-tight text-white leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            The Developer Experience is{" "}
            <span className="font-bold text-red-500">Broken</span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-white/70 mb-12 max-w-3xl font-mono leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            Context switching between 47 different tools. Waiting 20 minutes for
            CI/CD pipelines. Debugging deployment failures at 2 AM.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeInOut" }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Tool Overload
                </h3>
                <p className="text-white/70 leading-relaxed font-mono">
                  Managing separate tools for code review, testing, deployment,
                  and monitoring fragments your workflow.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: "easeInOut" }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Slow Feedback Loops
                </h3>
                <p className="text-white/70 leading-relaxed font-mono">
                  Waiting hours for test results and deployment feedback kills
                  momentum and productivity.
                </p>
              </motion.div>
            </div>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeInOut" }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Security Blind Spots
                </h3>
                <p className="text-white/70 leading-relaxed font-mono">
                  Vulnerabilities slip through without comprehensive, automated
                  security scanning in your workflow.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: "easeInOut" }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Configuration Hell
                </h3>
                <p className="text-white/70 leading-relaxed font-mono">
                  Spending more time configuring tools than actually building
                  features that matter.
                </p>
              </motion.div>
            </div>
          </div>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            <button className="px-8 py-3 bg-white text-black text-base font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg">
              See How We Fix This
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function SocialProofSection() {
  const devMetrics = [
    {
      id: 1,
      metric: "Deploy Frequency",
      value: "47x",
      description: "Faster than industry average",
      tech: "CI/CD Pipeline",
      gradientFrom: "#3B82F6",
      gradientTo: "#1E40AF",
    },
    {
      id: 2,
      metric: "MTTR",
      value: "< 5min",
      description: "Mean time to recovery",
      tech: "Auto Rollback",
      gradientFrom: "#10B981",
      gradientTo: "#059669",
    },
    {
      id: 3,
      metric: "Code Coverage",
      value: "94.7%",
      description: "Automated test generation",
      tech: "AI Testing",
      gradientFrom: "#F59E0B",
      gradientTo: "#D97706",
    },
    {
      id: 4,
      metric: "Security Score",
      value: "A+",
      description: "Zero critical vulnerabilities",
      tech: "SAST/DAST",
      gradientFrom: "#EF4444",
      gradientTo: "#DC2626",
    },
  ];

  const testimonials = [
    {
      id: 1,
      company: "Stripe",
      role: "Staff Engineer",
      quote:
        "Reduced our build times from 45 minutes to 8 minutes. The AI catches edge cases our manual reviews miss.",
      author: "Alex Chen",
      gradientFrom: "#8B5CF6",
      gradientTo: "#7C3AED",
    },
    {
      id: 2,
      company: "Linear",
      role: "Senior DevOps",
      quote:
        "Deployment confidence went from 60% to 98%. Zero production incidents in 6 months.",
      author: "Sarah Kim",
      gradientFrom: "#06B6D4",
      gradientTo: "#0891B2",
    },
    {
      id: 3,
      company: "Vercel",
      role: "Platform Lead",
      quote:
        "Security scanning integrated seamlessly. Blocked 127 potential vulnerabilities pre-production.",
      author: "Marcus Johnson",
      gradientFrom: "#F97316",
      gradientTo: "#EA580C",
    },
    {
      id: 4,
      company: "Railway",
      role: "CTO",
      quote:
        "Developer velocity increased 340%. Team ships features daily instead of weekly sprints.",
      author: "Jordan Lee",
      gradientFrom: "#EC4899",
      gradientTo: "#DB2777",
    },
  ];

  return (
    <div className="relative z-10 my-24 max-w-[1400px] mx-auto px-5 md:px-10">
      {/* Section Header */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        viewport={{ once: true }}
      >
        <motion.div
          className="inline-block mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-mono">
            {"// PRODUCTION_METRICS"}
          </span>
        </motion.div>
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 tracking-tighter leading-tight text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          Performance that speaks in code
        </motion.h2>
        <motion.p
          className="text-white/70 text-base max-w-2xl font-mono leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          Real metrics from engineering teams shipping at scale
        </motion.p>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
        viewport={{ once: true }}
      >
        {devMetrics.map((metric, index) => (
          <MagicCard
            key={metric.id}
            className="group relative overflow-hidden rounded-lg shadow-lg h-[140px]"
            gradientFrom={metric.gradientFrom}
            gradientTo={metric.gradientTo}
            gradientOpacity={0.1}
            gradientSize={200}
          >
            <motion.div
              className="p-4 h-full flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.4 + index * 0.1,
                ease: "easeInOut",
              }}
              viewport={{ once: true }}
            >
              <div>
                <div className="text-xs text-white/60 font-mono mb-1">
                  {metric.tech}
                </div>
                <div className="text-lg md:text-xl font-bold text-white font-mono tracking-tight">
                  {metric.value}
                </div>
              </div>
              <div>
                <div className="text-xs text-white/80 font-medium mb-1">
                  {metric.metric}
                </div>
                <div className="text-xs text-white/60 leading-tight">
                  {metric.description}
                </div>
              </div>
            </motion.div>
          </MagicCard>
        ))}
      </motion.div>

      {/* Testimonials Grid */}
      <motion.div
        className="grid md:grid-cols-2 gap-6 mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
        viewport={{ once: true }}
      >
        {testimonials.map((testimonial, index) => (
          <MagicCard
            key={testimonial.id}
            className="group relative overflow-hidden rounded-xl shadow-xl"
            gradientFrom={testimonial.gradientFrom}
            gradientTo={testimonial.gradientTo}
            gradientOpacity={0.1}
            gradientSize={300}
          >
            <motion.div
              className="p-6 h-full"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.6 + index * 0.1,
                ease: "easeInOut",
              }}
              viewport={{ once: true }}
            >
              {/* Company Badge */}
              <div className="inline-block mb-4">
                <span className="text-xs font-mono px-2 py-1 rounded bg-white/10 text-white/80 border border-white/20">
                  {testimonial.company}
                </span>
              </div>

              {/* Quote */}
              <p className="text-white/90 text-sm leading-relaxed mb-6 font-light">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium text-sm">
                    {testimonial.author}
                  </div>
                  <div className="text-white/60 text-xs font-mono">
                    {testimonial.role}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white/60 rounded-full" />
                </div>
              </div>

              {/* Floating indicator */}
              <motion.div
                className="absolute top-4 right-4 w-1 h-1 bg-white/40 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5,
                }}
              />
            </motion.div>
          </MagicCard>
        ))}

        {/* Spacer for uneven grid items */}
        <div className="hidden md:block md:col-span-2" />
      </motion.div>

      {/* Company Ticker */}
      <motion.div
        className="border-t border-white/10 pt-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: "easeInOut" }}
        viewport={{ once: true }}
      >
        <div className="mb-6">
          <span className="text-xs text-white/60 font-mono tracking-[0.2em] uppercase">
            {"// ACTIVE_INTEGRATIONS"}
          </span>
        </div>

        <div className="overflow-hidden">
          <motion.div
            className="flex gap-12 items-center"
            animate={{ x: [0, -50] }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[
              "GitHub Actions",
              "GitLab CI",
              "Docker",
              "Kubernetes",
              "AWS ECS",
              "Terraform",
              "Datadog",
              "Sentry",
              "GitHub Actions",
              "GitLab CI",
              "Docker",
              "Kubernetes",
            ].map((tech, index) => (
              <div
                key={`${tech}-${index}`}
                className="flex-shrink-0 text-white/50 font-mono text-sm min-w-[120px] text-center hover:text-white/80 transition-colors"
              >
                {tech}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 hidden md:block">
        <motion.div
          className="w-1 h-1 bg-white/30 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="absolute bottom-20 right-16 hidden md:block">
        <motion.div
          className="w-2 h-2 border border-white/30 rotate-45"
          animate={{
            rotate: [45, 225, 45],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}

function PricingSection() {
  const plans = [
    {
      id: 1,
      name: "Starter",
      price: "Free",
      features: [
        "1 User",
        "Basic Support",
        "Limited Features",
        "Community Access",
      ],
      popular: false,
      gradientFrom: "#3B82F6",
      gradientTo: "#1E40AF",
    },
    {
      id: 2,
      name: "Team",
      price: "$14/mo",
      features: [
        "5 Users",
        "Priority Support",
        "Advanced Features",
        "Integrations",
      ],
      popular: true,
      gradientFrom: "#10B981",
      gradientTo: "#059669",
    },
    {
      id: 3,
      name: "Enterprise",
      price: "Contact Us",
      features: [
        "Unlimited Users",
        "24/7 Support",
        "All Features",
        "Dedicated Account Manager",
      ],
      popular: false,
      gradientFrom: "#F97316",
      gradientTo: "#EA580C",
    },
  ];

  return (
    <div className="relative z-10 my-32 max-w-[1400px] mx-auto px-4 md:px-10">
      {/* Section Header */}
      <motion.div
        className="mb-12 md:mb-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        viewport={{ once: true }}
      >
        <motion.div
          className="inline-block mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-mono">
            {"// PRICING_MODULES"}
          </span>
        </motion.div>
        <motion.h2
          className="text-2xl md:text-4xl lg:text-5xl font-semibold mb-4 md:mb-5 tracking-tighter leading-tight text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          Scale with your codebase
        </motion.h2>
        <motion.p
          className="text-white/70 text-sm md:text-base max-w-2xl mx-auto font-mono px-4 md:px-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          Choose the plan that fits your development workflow and team size
        </motion.p>
      </motion.div>

      {/* Pricing Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
        viewport={{ once: true }}
      >
        {plans.map((plan, index) => (
          <MagicCard
            key={plan.id}
            className="group relative overflow-hidden rounded-xl md:rounded-2xl shadow-xl"
            gradientFrom={plan.gradientFrom}
            gradientTo={plan.gradientTo}
            gradientOpacity={0.8}
            gradientSize={300}
          >
            <motion.div
              className="p-4 md:p-6 h-full flex flex-col min-h-[320px] md:min-h-[400px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.4 + index * 0.1,
                ease: "easeInOut",
              }}
              viewport={{ once: true }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-white text-black text-xs font-semibold rounded-full px-2 md:px-3 py-1 shadow-md">
                  Most Popular
                </div>
              )}

              {/* Plan Name and Price */}
              <div className="flex flex-col gap-2 mb-4 md:mb-6">
                <div className="text-xl md:text-2xl font-extrabold text-white">
                  {plan.name}
                </div>
                <div className="text-base md:text-lg font-mono text-white/80">
                  {plan.price}
                </div>
              </div>

              {/* Features List */}
              <div className="flex-1">
                <ul className="space-y-2 mb-4 md:mb-6">
                  {plan.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center gap-3 text-white/90 text-sm"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.5 + index * 0.1,
                        ease: "easeInOut",
                      }}
                      viewport={{ once: true }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <motion.button
                className="mt-auto px-6 md:px-8 py-2 md:py-3 rounded-full bg-white text-black text-sm md:text-base font-semibold shadow-md transition hover:bg-gray-100 w-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7, ease: "easeInOut" }}
                viewport={{ once: true }}
              >
                Choose Plan
              </motion.button>
            </motion.div>
          </MagicCard>
        ))}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="mt-8 md:mt-12 text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: "easeInOut" }}
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center gap-3 bg-white/5 rounded-lg p-3 md:p-4 border border-white/10 max-w-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
          <p className="text-xs md:text-sm text-white/80 font-mono">
            Start with the plan that fits your team. Upgrade or downgrade any
            time.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Footer() {
  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Documentation", href: "/docs" },
      { name: "API Reference", href: "/api" },
      { name: "Changelog", href: "/changelog" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Press Kit", href: "/press" },
      { name: "Contact", href: "/contact" },
    ],
    developers: [
      { name: "GitHub", href: "https://github.com" },
      { name: "Status Page", href: "/status" },
      { name: "Community", href: "/community" },
      { name: "Discord", href: "https://discord.gg" },
      { name: "Stack Overflow", href: "https://stackoverflow.com" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Security", href: "/security" },
      { name: "Compliance", href: "/compliance" },
    ],
  };

  const socialLinks = [
    { name: "GitHub", href: "https://github.com", icon: "⚡" },
    { name: "Twitter", href: "https://twitter.com", icon: "🐦" },
    { name: "LinkedIn", href: "https://linkedin.com", icon: "💼" },
    { name: "Discord", href: "https://discord.gg", icon: "💬" },
  ];

  return (
    <motion.footer
      className="relative mt-24 bgg"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      viewport={{ once: true }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 "
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 md:px-10 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Brand Section */}
          <motion.div
            className="col-span-2 lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            <div className="mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 tracking-tight">
                Zen.
              </h3>
              <p className="text-white/70 text-sm md:text-base font-mono leading-relaxed max-w-xs">
                The developer experience platform that brings clarity to chaos.
                Ship faster, break less, sleep better.
              </p>
            </div>

            {/* Terminal-style status */}
            <div className="bg-[#0f1013] rounded-lg p-3 md:p-4 border border-[#3f4042] font-mono text-xs">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400">$ system_status</span>
              </div>
              <div className="text-white/60 space-y-1">
                <div>
                  • API: <span className="text-green-400">healthy</span>
                </div>
                <div>
                  • Uptime: <span className="text-green-400">99.99%</span>
                </div>
                <div>
                  • Deploy: <span className="text-blue-400">v2.1.3</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            <h4 className="text-white font-medium mb-3 md:mb-4 text-xs md:text-sm uppercase tracking-wide">
              Product
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.product.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.3 + index * 0.05,
                    ease: "easeInOut",
                  }}
                  viewport={{ once: true }}
                >
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white text-xs md:text-sm transition-colors font-mono"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            <h4 className="text-white font-medium mb-3 md:mb-4 text-xs md:text-sm uppercase tracking-wide">
              Company
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.company.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.4 + index * 0.05,
                    ease: "easeInOut",
                  }}
                  viewport={{ once: true }}
                >
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white text-xs md:text-sm transition-colors font-mono"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Developers Links */}
          <motion.div
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            <h4 className="text-white font-medium mb-3 md:mb-4 text-xs md:text-sm uppercase tracking-wide">
              Developers
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.developers.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.5 + index * 0.05,
                    ease: "easeInOut",
                  }}
                  viewport={{ once: true }}
                >
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white text-xs md:text-sm transition-colors font-mono"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            <h4 className="text-white font-medium mb-3 md:mb-4 text-xs md:text-sm uppercase tracking-wide">
              Legal
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.legal.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.6 + index * 0.05,
                    ease: "easeInOut",
                  }}
                  viewport={{ once: true }}
                >
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white text-xs md:text-sm transition-colors font-mono"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          className="border-t border-[#3f4042] pt-6 md:pt-8 mb-6 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-white font-semibold mb-2 text-sm md:text-base">
                Stay in the loop
              </h4>
              <p className="text-white/60 text-xs md:text-base font-mono">
                Get updates on new features, releases, and developer content.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:max-w-md">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-[#1a1b1f] border border-[#3f4042] rounded-lg text-white placeholder-white/40 text-sm md:text-base focus:outline-none focus:border-blue-500 transition-colors font-mono"
              />
              <button className="px-4 md:px-8 py-2 md:py-3 bg-white text-black text-sm md:text-base font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-[#3f4042] pt-6 md:pt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
              <p className="text-white/60 text-xs md:text-base font-mono">
                © 2024 Zen. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
                <span>Built with</span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-red-400"
                >
                  ♥
                </motion.span>
                <span>for developers</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center md:justify-end gap-3 md:gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="w-8 h-8 md:w-10 md:h-10 bg-[#1a1b1f] border border-[#3f4042] rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 transition-all duration-300"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.8 + index * 0.05,
                    ease: "easeInOut",
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xs md:text-sm">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Floating decorative elements */}
        <div className="absolute top-10 right-10 hidden lg:block">
          <motion.div
            className="w-1 h-1 bg-white/20 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="absolute bottom-20 left-10 hidden lg:block">
          <motion.div
            className="w-2 h-2 border border-white/20 rotate-45"
            animate={{
              rotate: [45, 225, 45],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      </div>
    </motion.footer>
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
      <section className="min-h-screen bgg w-full px-4 md:px-10 pt-16 overflow-hidden">
        <div className="space-y-32">
          <HeroParallaxSection
            refObj={ref}
            parallaxX={parallaxX}
            parallaxY={parallaxY}
            handleMouseMove={handleMouseMove}
            handleMouseLeave={handleMouseLeave}
          />

          <ProblemSection
            parallaxX={parallaxX}
            parallaxY={parallaxY}
            handleMouseMove={handleMouseMove}
            handleMouseLeave={handleMouseLeave}
          />

          <SocialProofSection />

          <motion.div
            className="relative z-10 flex flex-col gap-8 text-left max-w-[1400px] mx-auto px-5 md:px-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            <DescriptionBlock />
            <FeaturesSection features={features} />
          </motion.div>

          <PricingSection />

          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative z-10 rounded-xl md:rounded-[2rem] overflow-hidden w-full bg-black py-12 md:py-16 px-6 md:px-12 text-white text-center flex flex-col items-center justify-center max-w-[1400px] mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            <motion.img
              src="/cta.png"
              className="absolute inset-0 object-cover w-full h-full -z-20"
              style={{ x: parallaxX, y: parallaxY, scale: 1.1 }}
              alt="CTA Background"
            />
            <div className="absolute inset-0 bg-black/60 -z-10" />

            <motion.div
              className="inline-block mb-3 md:mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              viewport={{ once: true }}
            >
              <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-mono">
                {"// GET_STARTED"}
              </span>
            </motion.div>

            <motion.h2
              className="text-2xl md:text-4xl lg:text-5xl font-semibold mb-4 md:mb-6 tracking-tighter leading-tight px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeInOut" }}
              viewport={{ once: true }}
            >
              We're developers. We get you.
            </motion.h2>
            <motion.p
              className="text-sm md:text-lg mb-6 md:mb-8 max-w-2xl font-mono leading-relaxed text-white/70 px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
              viewport={{ once: true }}
            >
              Got questions? Need help with your dev workflow? Don't hesitate —
              reach out and we'll get you started.
            </motion.p>
            <motion.button
              className="mt-2 md:mt-4 px-6 md:px-8 py-2 md:py-3 rounded-full bg-white text-black text-sm md:text-base font-semibold shadow-lg transition hover:bg-gray-100 w-auto min-w-[160px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
              viewport={{ once: true }}
            >
              Contact Us
            </motion.button>
          </motion.div>

          <Footer />
        </div>
      </section>
    </>
  );
}
