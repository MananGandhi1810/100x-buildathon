import { Feature197 } from "@/components/features";
import { Hero3 } from "@/components/hero";
import { Cta4 } from "@/components/cta";
import { Contact2 } from "@/components/contact";
import { Pricing4 } from "@/components/price";
import { Testimonial14 } from "@/components/testimonial";
import { DotsBackground } from "@/components/dots";

export default function Home() {
  return (
    <>
      <Hero3
        heading="Ship Code 10x Faster"
        description="AI-powered development tools that eliminate bugs, automate workflows, and accelerate your entire software development lifecycle."
        buttons={{
          primary: {
            text: "Connect GitHub - Free",
            url: "#",
          },
          secondary: {
            text: "Watch Demo",
            url: "#",
          },
        }}
        reviews={{
          count: 25000,
          rating: 5.0,
          avatars: [
            {
              src: "https://github.com/github.png",
              alt: "GitHub",
            },
            {
              src: "https://github.com/vercel.png",
              alt: "Vercel",
            },
            {
              src: "https://github.com/stripe.png",
              alt: "Stripe",
            },
            {
              src: "https://github.com/shopify.png",
              alt: "Shopify",
            },
            {
              src: "https://github.com/discord.png",
              alt: "Discord",
            },
          ],
        }}
      />
      <Feature197
        features={[
          {
            id: 1,
            title: "README Generator",
            description:
              "AI-powered documentation generation that creates comprehensive README files from your codebase in seconds.",
            gradient: "bg1",
          },
          {
            id: 2,
            title: "Pull Request Analyzer",
            description:
              "Intelligent PR analysis with automated code reviews, impact assessment, and merge recommendations.",
            gradient: "bg2",
          },
          {
            id: 3,
            title: "Vulnerability Scanner",
            description:
              "Advanced security scanning that identifies vulnerabilities, OWASP compliance issues, and suggests fixes.",
            gradient: "bg3",
          },
          {
            id: 4,
            title: "Chat with Code",
            description:
              "Natural language interface to understand, debug, and modify your codebase through conversational AI.",
            gradient: "bg1",
          },
          {
            id: 5,
            title: "Deploy with Chat",
            description:
              "Conversational deployment pipeline that handles CI/CD, environment setup, and monitoring configuration.",
            gradient: "bg2",
          },
          {
            id: 6,
            title: "Code Structure Visualization",
            description:
              "Interactive dependency graphs and architecture diagrams to understand complex codebases instantly.",
            gradient: "bg3",
          },
          {
            id: 7,
            title: "Automated Testing",
            description:
              "AI-generated test suites with edge case detection, performance testing, and coverage optimization.",
            gradient: "bg1",
          },
        ]}
      />
      <Cta4
        title="Ready to transform your development workflow?"
        description="Join 25,000+ developers who are shipping better code, faster with AI-powered development tools."
        buttonText="Start Free Trial"
        buttonUrl="#"
        items={[
          "14-day free trial",
          "No credit card required",
          "Cancel anytime",
          "24/7 support",
          "Unlimited repositories",
        ]}
      />
      <Contact2
        title="Get in Touch"
        description="Have questions about our AI-powered development tools? Our team is here to help you get started."
        phone="+1 (555) 123-4567"
        email="support@codeai.com"
        web={{ label: "codeai.com", url: "https://codeai.com" }}
      />
      <Pricing4 />
      <Testimonial14 />
    </>
  );
}
