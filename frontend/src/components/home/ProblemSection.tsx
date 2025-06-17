"use client";
import { motion } from "motion/react";

export default function ProblemSection({
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
      className="relative my-32 w-full max-w-[1400px] mx-auto px-5 md:px-10"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      viewport={{ once: true }}
    >
      <div className="bg-[#0f1013] border border-[#3f4042] rounded-3xl p-8 md:p-16 shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute top-8 right-8 w-3 h-3 bg-red-500/60 rounded-full" />
        <div className="absolute top-16 right-16 w-1 h-1 bg-white/40 rounded-full" />

        <div className="max-w-5xl">
          <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-mono">
            {"// THE_REALITY"}
          </span>
          <motion.h2
            className="text-3xl md:text-4xl lg:text-6xl font-bold my-8 tracking-tight text-white leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            The Developer Experience is{" "}
            <span className="font-black text-red-500 relative">
              Broken
              <motion.div
                className="absolute -bottom-2 left-0 w-full h-1 bg-red-500/50 rounded"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
                viewport={{ once: true }}
              />
            </span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-2xl text-white/80 mb-16 max-w-4xl font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            Modern development shouldn't require juggling 47 different tools,
            waiting 20 minutes for CI/CD pipelines, or debugging deployment
            failures at 2 AM.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <div className="space-y-10">
              <motion.div
                className="group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeInOut" }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-red-400 transition-colors">
                    Tool Fragmentation
                  </h3>
                </div>
                <p className="text-white/70 leading-relaxed font-light pl-6">
                  Separate tools for code review, testing, deployment, and
                  monitoring create cognitive overhead that fragments your
                  development flow.
                </p>
              </motion.div>

              <motion.div
                className="group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: "easeInOut" }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-red-400 transition-colors">
                    Broken Feedback Loops
                  </h3>
                </div>
                <p className="text-white/70 leading-relaxed font-light pl-6">
                  Hours of waiting for test results and deployment feedback
                  kills momentum. By the time you get feedback, you've already
                  context-switched.
                </p>
              </motion.div>
            </div>

            <div className="space-y-10">
              <motion.div
                className="group"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeInOut" }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-red-400 transition-colors">
                    Security Afterthoughts
                  </h3>
                </div>
                <p className="text-white/70 leading-relaxed font-light pl-6">
                  Security scanning happens too late in the process.
                  Vulnerabilities discovered in production cost 100x more to fix
                  than in development.
                </p>
              </motion.div>

              <motion.div
                className="group"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: "easeInOut" }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-red-400 transition-colors">
                    Configuration Complexity
                  </h3>
                </div>
                <p className="text-white/70 leading-relaxed font-light pl-6">
                  Teams spend more time configuring toolchains than building
                  features. Every new project requires weeks of setup before
                  writing the first line of code.
                </p>
              </motion.div>
            </div>
          </div>

          <motion.div
            className="mt-16 flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            <button className="px-8 py-4 bg-white text-black text-base font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              See Our Solution →
            </button>
            <button className="px-8 py-4 border-2 border-white/20 text-white text-base font-medium rounded-full hover:bg-white/5 hover:border-white/40 transition-all duration-300">
              Read Case Studies
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
