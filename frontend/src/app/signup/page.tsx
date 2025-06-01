"use client";
import { Github, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "motion/react";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const accessToken = sessionStorage.getItem("accessToken");
        if (accessToken) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/user`,
            { headers: { authorization: `Bearer ${accessToken}` } }
          );
          if (response.data.data.user) {
            router.replace("/dashboard");
          }
        }
      } catch (error) {
        console.error("Error during signup:", error);
        setError(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar></Navbar>
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <h1 className="text-5xl font-medium tracking-tight text-white">
                Build with CodeAI
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Enterprise-grade AI platform for secure, efficient, and
                intelligent code development.
              </p>
            </div>

            <div className="space-y-6">
              {[
                "AI-Powered PR Analysis",
                "Automated Code Testing",
                "Instant Vulnerability Scanning",
                "One-Click Deployments from GitHub",
                "AI-Generated README Files",
                "Natural Language Chat with Codebase",
                "Visual Code Structure Mapping",
                "Instant Dev Environment Provisioning",
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start space-x-4 group"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5 transition-colors duration-300 group-hover:bg-primary/20">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-lg text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {feature}
                  </h3>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Signup Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="w-full max-w-md bg-card/50 border-border/20 backdrop-blur-sm">
              <CardHeader className="space-y-4">
                <CardTitle className="text-3xl font-medium tracking-tight">
                  Create an account
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Sign up with GitHub to get started in seconds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <a
                  href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GH_CLIENT_ID}&scope=user%20repo`}
                  className="block"
                >
                  <Button
                    className="w-full h-14 bg-white text-black hover:bg-slate-100 transition-all duration-300 group"
                    size="lg"
                  >
                    <Github className="mr-3 h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                    Continue with GitHub
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </a>

                <Separator className="my-6" />

                <div className="space-y-4 text-center text-sm text-muted-foreground">
                  <p>
                    By creating an account, you agree to our{" "}
                    <a href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </p>
                  <p>
                    Already have an account?{" "}
                    <a href="/signup" className="text-primary hover:underline">
                      Sign in
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
