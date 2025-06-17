"use client";
import { motion } from "motion/react";
import { MagicCard } from "../magicui/magic-card";

export default function PricingSection() {
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
        {" "}
        {plans.map((plan, index) => (
          <MagicCard
            key={plan.id}
            className="group relative overflow-hidden rounded-xl md:rounded-2xl shadow-xl bg-[#0f1013] border border-white/10"
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
