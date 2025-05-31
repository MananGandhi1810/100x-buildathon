import { Hero3 } from "@/components/hero";
import { Feature197 } from "@/components/features";
import { Cta4 } from "@/components/cta";
import { Contact2 } from "@/components/contact";
import { Pricing4 } from "@/components/price";
import { Testimonial14 } from "@/components/testimonial";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="container pt-24 mx-auto px-4 max-w-7xl py-16">
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent opacity-50 blur-3xl" />
          <Hero3
            heading="Ship Better Code, Faster with AI"
            description="YetiCodes helps developers write, review, and ship better code with AI-powered tools. Get instant code reviews, automated testing, and intelligent suggestions."
            buttons={{
              primary: {
                text: "Get Started Free",
                url: "/signup",
              },
              secondary: {
                text: "View Demo",
                url: "/demo",
              },
            }}
            reviews={{
              count: 25000,
              rating: 5.0,
              avatars: [
                {
                  src: "/avatars/avatar-1.png",
                  alt: "Google",
                },
                {
                  src: "/avatars/avatar-2.png",
                  alt: "Microsoft",
                },
                {
                  src: "/avatars/avatar-3.png",
                  alt: "Amazon",
                },
                {
                  src: "/avatars/avatar-4.png",
                  alt: "Meta",
                },
                {
                  src: "/avatars/avatar-5.png",
                  alt: "Apple",
                },
              ],
            }}
          />
        </section>

        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent opacity-50 blur-3xl -z-10" />
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
        </section>

        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent opacity-50 blur-3xl" />
          <Cta4
            title="Ready to transform your development workflow?"
            description="Join 25,000+ developers who are shipping better code, faster with AI-powered development tools."
            buttonText="Start Free Trial"
            buttonUrl="/signup"
            items={[
              "14-day free trial",
              "No credit card required",
              "Cancel anytime",
              "24/7 support",
              "Unlimited repositories",
            ]}
          />
        </section>

        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent opacity-50 blur-3xl" />
          <Testimonial14
            title="Trusted by Developers Worldwide"
            description="Join thousands of developers who are shipping better code, faster with AI-powered development tools"
            testimonials={[
              {
                name: "Sarah Chen",
                role: "Engineering Manager",
                company: "TechCorp",
                content:
                  "YetiCodes has transformed our development workflow. The AI-powered code reviews have increased our team's velocity by 40% while maintaining code quality.",
                rating: 5,
                avatar: "/avatars/sarah.png",
              },
              {
                name: "Michael Rodriguez",
                role: "Senior Full-Stack Developer",
                company: "TechCorp",
                content:
                  "The vulnerability scanner is incredibly effective. It caught several security issues that our manual reviews missed, saving us from potential breaches.",
                rating: 5,
                avatar: "/avatars/michael.png",
              },
              {
                name: "Emily Watson",
                role: "CTO",
                company: "StartupXYZ",
                content:
                  "The 'Chat with Code' feature is revolutionary. Our junior developers can now understand and modify complex codebases with confidence.",
                rating: 5,
                avatar: "/avatars/emily.png",
              },
            ]}
          />
        </section>

        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent opacity-50 blur-3xl" />
          <Pricing4
            title="Simple, transparent pricing"
            description="Choose the plan that fits your team size and needs"
            plans={[
              {
                name: "Developer",
                price: {
                  monthly: 29,
                  yearly: 290,
                },
                description:
                  "Perfect for individual developers and small projects",
                features: [
                  "Unlimited code reviews",
                  "Basic vulnerability scanning",
                  "Chat with Code (5 hours/month)",
                  "1 repository",
                  "Email support",
                ],
                badge: "Popular",
                isPopular: true,
              },
              {
                name: "Team",
                price: {
                  monthly: 99,
                  yearly: 990,
                },
                description: "Ideal for growing teams and larger projects",
                features: [
                  "Everything in Developer",
                  "Advanced security scanning",
                  "Chat with Code (20 hours/month)",
                  "5 repositories",
                  "Priority support",
                  "Team collaboration",
                  "Custom integrations",
                ],
                badge: "Best Value",
                isPopular: false,
              },
              {
                name: "Enterprise",
                price: {
                  monthly: 299,
                  yearly: 2990,
                },
                description: "For organizations with advanced needs",
                features: [
                  "Everything in Team",
                  "Unlimited repositories",
                  "Unlimited Chat with Code",
                  "Custom AI model training",
                  "Dedicated support",
                  "SLA guarantees",
                  "Advanced analytics",
                  "Custom deployment",
                ],
                badge: "Enterprise",
                isPopular: false,
              },
            ]}
          />
        </section>

        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent opacity-50 blur-3xl" />
          <Contact2
            title="Get in Touch"
            description="Have questions about our AI-powered development tools? Our team is here to help you get started."
            phone="+1 (555) 123-4567"
            email="support@yeticodes.com"
            web={{ label: "yeticodes.com", url: "https://yeticodes.com" }}
          />
        </section>
      </main>{" "}
    </>
  );
}
