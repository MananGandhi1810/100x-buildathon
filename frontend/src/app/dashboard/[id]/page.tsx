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
        href: (repoSlug: string) =>
            `/dashboard/${repoSlug}/vulnerability-scanner`,
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
                            Authorization: `Bearer ${sessionStorage.getItem(
                                "accessToken",
                            )}`,
                        },
                    },
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
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 h-4"
                            />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/dashboard">
                                            Dashboard
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col items-center justify-center p-6">
                        <h1 className="text-2xl font-bold">
                            Project Not Found
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            The project you&apos;re looking for doesn&apos;t
                            exist or could not be loaded.
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
        description:
            projectData.description || `Project: ${projectData.repoUrl}`,
        stars: 0,
        forks: 0,
        language: projectData.language || "Unknown",
        lastUpdated: "Recently",
    };

    return (
        <SidebarProvider>
            <DevToolsSidebar id={params.id} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-grain">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard">
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        {displayData.name}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-6 p-6 bg-grain">
                    <div className="space-y-6 ">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {displayData.name}
                            </h1>
                            <p className="text-muted-foreground mt-1.5">
                                {displayData.description}
                            </p>
                            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    <span>
                                        {displayData.stars.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <GitFork className="h-4 w-4 text-blue-500" />
                                    <span>
                                        {displayData.forks.toLocaleString()}
                                    </span>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium">
                                    {displayData.language}
                                </span>
                                <span className="text-xs">
                                    Updated {displayData.lastUpdated}
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {tools.map((tool) => (
                                <Card
                                    key={tool.title}
                                    className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50"
                                >
                                    <a
                                        href={tool.href(params.id)}
                                        className="block"
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`p-2 rounded-lg bg-muted/50 ${tool.color}`}
                                                >
                                                    <tool.icon className="h-5 w-5" />
                                                </div>
                                                <CardTitle className="text-base group-hover:text-primary transition-colors">
                                                    {tool.title}
                                                </CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="line-clamp-2">
                                                {tool.description}
                                            </CardDescription>
                                        </CardContent>
                                    </a>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
