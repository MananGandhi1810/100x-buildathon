"use client";
import { motion } from "motion/react";
export default function HowToUseSection() {
  return (
    <div className="relative z-10 my-32 max-w-[1400px] mx-auto px-4 md:px-10">
      {/* Section Header */}
      <motion.div
        className="mb-16 text-center"
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
            {"// HOW_IT_WORKS"}
          </span>
        </motion.div>
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tighter leading-tight text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          Deploy in Minutes, Not Hours
        </motion.h2>
        <motion.p
          className="text-white/70 text-xl max-w-3xl mx-auto font-light leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          Simply import your repository and we handle everything else. No
          configuration files, no complex setup - just professional deployments
          in minutes.
        </motion.p>
      </motion.div>

      {/* Main Content - Simple Text Left, Video Right */}
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Side - Simple Message */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          <div className="space-y-6">
            <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              It's really that simple.
            </h3>
            <p className="text-white/80 text-xl leading-relaxed font-light">
              Connect your GitHub repository and watch your code transform into
              a production-ready deployment with automated testing, security
              scanning, and monitoring.
            </p>
          </div>

          <div className="bg-[#0f1013] border border-white/10 rounded-2xl p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white/70">Import Repository</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-white/70">AI Configures Everything</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-white/70">Deploy & Monitor</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-white text-black text-base font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:shadow-xl transform hover:scale-105">
              Get Started Now
            </button>
            <button className="px-8 py-4 border-2 border-white/20 text-white text-base font-medium rounded-full hover:bg-white/5 hover:border-white/40 transition-all duration-300">
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Right Side - Video */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          <div className="relative bg-[#0f1013] border border-white/10 rounded-3xl p-6 h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden">
            {/* Video Container */}
            <div className="w-full h-full bg-[#1a1b1f] rounded-2xl flex items-center justify-center relative overflow-hidden">
              {/* Play Button */}
              <motion.div
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-2xl z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-0 h-0 border-l-[12px] border-l-black border-y-[8px] border-y-transparent ml-1"></div>
              </motion.div>

              {/* Video Background */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="text-white/40 text-center">
                  <div className="text-sm font-mono mb-2">LIVE DEMO</div>
                  <div className="text-xs">See it in action</div>
                </div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute top-6 left-6 w-3 h-3 bg-green-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-6 right-6 w-2 h-2 bg-blue-400 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </div>
          </div>{" "}
        </motion.div>
      </div>
    </div>
  );
}
