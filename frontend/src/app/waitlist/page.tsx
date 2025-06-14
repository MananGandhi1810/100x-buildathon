"use client";
import { Github, Check, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { MagicCard } from "@/components/magicui/magic-card";
import posthog from "posthog-js";
import { submitEmail } from "@/action/waitlist";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
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
            const user = response.data.data.user;
            console.log("User is authenticated:", user);
            posthog.identify(user.id, {
              email: user.email,
              name: user.name,
            });
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="relative z-10 flex min-h-[80vh] max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-xl">
          {/* Left side - Image skeleton */}
          <div className="hidden lg:block lg:w-1/2">
            <Skeleton className="w-full h-full rounded-l-3xl" />
          </div>

          {/* Right side - Auth Card skeleton */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-px w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="relative z-10 flex min-h-[100vh] w-screen mx-auto rounded-3xl overflow-hidden shadow-xl bgg">
        {/* Left side - Image */}
        <div
          className="hidden lg:block lg:w-1/2 bg-cover bg-center "
          style={{ backgroundImage: "url('/bg.png')" }}
        />

        {/* Right side - Auth Card */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md"
          >
            <MagicCard
              gradientFrom="#A07CFE"
              gradientTo="#FE8FB5"
              gradientOpacity={0.9}
              className="backdrop-blur-xl border border-white/10 w-full shadow-xl rounded-2xl p-10"
            >
              {" "}
              <CardHeader className="space-y-4 py-10">
                <CardTitle className="text-3xl font-bold tracking-tight text-white">
                  Join the waitlist
                </CardTitle>
                <CardDescription className="text-base text-white/80">
                  {submitSuccess
                    ? "Thank you! You've been added to our waitlist."
                    : "Be the first to know when we launch"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {submitSuccess ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white/80">
                      We'll notify you as soon as we're ready!
                    </p>
                  </div>
                ) : (
                  <>
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-14 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                          required
                        />
                        {error && (
                          <p className="text-red-300 text-sm">{error}</p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting || !email.trim()}
                        className="w-full h-14 bg-white text-black hover:bg-white/90 border border-black/10 shadow-md group disabled:opacity-50"
                        size="lg"
                      >
                        <Mail className="mr-3 h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                        {isSubmitting ? "Joining..." : "Join Waitlist"}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </form>

                    <Separator className="my-6 bg-white/20" />
                  </>
                )}
              </CardContent>
            </MagicCard>
          </motion.div>
        </div>
      </div>
    </>
  );
}
