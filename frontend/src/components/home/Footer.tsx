"use client";
import { motion } from "motion/react";
export default function Footer() {
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
    { name: "GitHub", href: "https://github.com" },
    { name: "Twitter", href: "https://twitter.com" },
    { name: "LinkedIn", href: "https://linkedin.com" },
    { name: "Discord", href: "https://discord.gg" },
  ];

  return (
    <motion.footer
      className="relative mt-24 bg-background"
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
        />{" "}
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 bg-white/5 rounded-full blur-3xl"
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
              </p>{" "}
              <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
                <span>Built with care for developers</span>
              </div>
            </div>{" "}
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
                  title={social.name}
                >
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
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
