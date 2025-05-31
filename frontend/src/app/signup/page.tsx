import { Github, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupPage() {
    return (
        <div className="relative z-10 container mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight text-white">Build with CodeAI</h1>
                        <p className="text-xl text-slate-400">
                            Enterprise-grade AI platform for secure, efficient, and intelligent code development.
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
                            <div key={index} className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                                    <Check className="w-4 h-4 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{feature}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>


                {/* Right side - Signup Form */}
                <div className="flex justify-center lg:justify-end">
                    <Card className="w-full max-w-md bg-gray-200 bg-opacity-50 border-slate-800 backdrop-blur-sm">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-white">Create an account</CardTitle>
                            <CardDescription className="text-slate-400">
                                Sign up with GitHub to get started in seconds
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <a
                                href={`https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&scope=user%20repo`}
                            >
                                <Button className="w-full bg-white text-black hover:bg-slate-100 transition-colors" size="lg">
                                    <Github className="mr-2 h-5 w-5" />
                                    Continue with GitHub
                                </Button>
                            </a>

                            <div className="text-center text-sm text-slate-400">
                                Already have an account?{" "}
                                <a href="/login" className="font-medium text-white hover:underline">
                                    Sign in
                                </a>
                            </div>

                            <div className="text-xs text-slate-500 text-center">
                                By creating an account, you agree to our{" "}
                                <a href="/terms" className="underline hover:text-slate-400">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="/privacy" className="underline hover:text-slate-400">
                                    Privacy Policy
                                </a>
                                .
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

    )
}
