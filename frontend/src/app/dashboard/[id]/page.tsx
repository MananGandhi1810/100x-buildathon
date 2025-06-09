"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { DevToolsSidebar } from "@/components/dev-tools-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Star,
  GitFork,
  FileText,
  GitPullRequest,
  Shield,
  MessageSquare,
  Rocket,
  Network,
  TestTube,
  Server,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MagicCard } from "@/components/magicui/magic-card";

const tools = [
  {
    title: "README Generator",
    description: "Generate comprehensive README files for your projects",
    icon: FileText,
    href: (repoSlug: string) => `/dashboard/${repoSlug}/readme-generator`,
    color: "text-blue-600",
  },
  {
    title: "Pull Request Analyzer",
    description: "Analyze and review pull requests with AI assistance",
    icon: GitPullRequest,
    href: (repoSlug: string) => `/dashboard/${repoSlug}/pr-analyzer`,
    color: "text-green-600",
  },
  {
    title: "Vulnerability Scanner",
    description: "Scan your code for security vulnerabilities",
    icon: Shield,
    href: (repoSlug: string) => `/dashboard/${repoSlug}/vulnerability-scanner`,
    color: "text-red-600",
  },
  {
    title: "Chat with Code",
    description: "Interactive AI assistant for your codebase",
    icon: MessageSquare,
    href: (repoSlug: string) => `/dashboard/${repoSlug}/chat-with-code`,
    color: "text-purple-600",
  },
  {
    title: "Deploy",
    description: "Deploy application",
    icon: Rocket,
    href: (repoSlug: string) => `/dashboard/${repoSlug}/deployments`,
    color: "text-orange-600",
  },
  {
    title: "Code Structure Visualization",
    description: "Visualize your project's architecture and dependencies",
    icon: Network,
    href: (repoSlug: string) => `/dashboard/${repoSlug}/code-structure`,
    color: "text-cyan-600",
  },
  {
    title: "Automated Testing",
    description: "Generate and run automated tests for your code",
    icon: TestTube,
    href: (repoSlug: string) => `/dashboard/${repoSlug}/automated-testing`,
    color: "text-yellow-600",
  },
  {
    title: "Environment Provisioning",
    description: "Set up development environments automatically",
    icon: Server,
    href: (repoSlug: string) =>
      `/dashboard/${repoSlug}/environment-provisioning`,
    color: "text-indigo-600",
  },
];

export default function DashboardPage() {
  const [projectData, setProjectData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const params = useParams<{ id: string }>();
  const repoSlug = params.id;

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/project/${repoSlug}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
          }
        );
        console.log("Project data response:", response.data.data);
        setProjectData(response.data.data.project);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [params.id]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error || !projectData) {
    return (
      <SidebarProvider>
        <DevToolsSidebar id={params.id} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 ">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 size-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col items-center justify-center p-6">
            <h1 className="text-2xl font-bold">Project Not Found</h1>
            <p className="text-muted-foreground mt-2">
              The project you&apos;re looking for doesn&apos;t exist or could
              not be loaded.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const displayData = {
    name: projectData.title || projectData.name,
    description: projectData.description || `Project: ${projectData.repoUrl}`,
    stars: 0,
    forks: 0,
    language: projectData.language || "Unknown",
    lastUpdated: "Recently",
  };

  return (
    <SidebarProvider className="bg-muted">
      <DevToolsSidebar id={params.id} />
      <SidebarInset className="bg-muted">
        <header className="flex h-16 shrink-0 items-center bg-muted gap-2 ">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{displayData.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-10 bg-background w-full  mx-auto rounded-tl-2xl">
          <div className="space-y-6 w-full md:max-w-7xl mx-auto">
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                {displayData.name}
              </h1>

              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 " />
                  <span>{displayData.stars.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GitFork className="h-4 w-4" />
                  <span>{displayData.forks.toLocaleString()}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium">
                  {displayData.language}
                </span>
                <span className="text-xs">
                  Updated {displayData.lastUpdated}
                </span>
              </div>
            </div>

            <div className="mx-auto grid grid-cols-1 gap-2 md:gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {tools.map((tool) => (
                <MagicCard
                  key={tool.title}
                  className="group relative text-left bg-card/50 backdrop-blur-[2px] border border-border/20 rounded-lg transition-all ease-in-out duration-300 cursor-pointer hover:bg-card/80 hover:border-border/40 hover:shadow-lg hover:shadow-black/5 min-h-32 md:min-h-44 h-44 !px-0 pt-5 pb-0 overflow-hidden"
                >
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-background/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Micro-pattern background */}
                  <div
                    className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-300"
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                      backgroundSize: "16px 16px",
                    }}
                  />

                  <Link
                    href={tool.href(params.id)}
                    className="flex h-full w-full flex-col space-y-2 relative z-10"
                  >
                    <div className="w-full justify-between space-y-2 px-5 h-full flex-1">
                      <div className="flex items-start gap-3">
                        {/* Icon container with subtle glow */}
                        <div className="relative flex-shrink-0 mt-0.5">
                          <div className="absolute inset-0 bg-foreground/5 rounded-md blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative p-1.5 rounded-md bg-muted/30 border border-border/10 group-hover:bg-muted/50 group-hover:border-border/20 transition-all duration-300">
                            <tool.icon className="h-4 w-4 text-foreground/70 group-hover:text-foreground transition-colors duration-300" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-foreground truncate pr-8 group-hover:text-foreground transition-colors duration-300">
                            {tool.title}
                          </h3>

                          {/* Status indicator */}
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-green-500/70 rounded-full animate-pulse" />
                              <span className="text-xs text-muted-foreground">
                                Active
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full !mt-auto">
                      <div className="relative w-full text-sm border-0 px-5 pb-5 bg-transparent">
                        <div className="flex justify-between items-start w-full gap-x-2">
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed group-hover:text-muted-foreground/80 transition-colors duration-300">
                            {tool.description}
                          </p>
                        </div>

                        {/* Usage indicator bar */}
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex-1 h-1 bg-muted/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary/60 to-primary/30 rounded-full transition-all duration-500 group-hover:from-primary/80 group-hover:to-primary/50"
                              style={{ width: `${Math.random() * 60 + 20}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground/60">
                            {Math.floor(Math.random() * 50 + 10)}% used
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced arrow with micro-animation */}
                    <div className="absolute right-4 top-4 text-muted-foreground/40 transition-all duration-300 group-hover:right-3 group-hover:text-foreground/60 group-hover:scale-110">
                      <div className="relative">
                        <div className="absolute inset-0 bg-foreground/5 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-chevron-right relative z-10"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </div>
                    </div>

                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Bottom border accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </MagicCard>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
