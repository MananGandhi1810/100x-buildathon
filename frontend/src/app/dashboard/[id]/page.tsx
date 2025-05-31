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
  FileText,
  GitPullRequest,
  Shield,
  MessageSquare,
  Rocket,
  Network,
  TestTube,
  Server,
  Star,
  GitFork,
  GitBranch,
  Code,
  Play,
  FolderTree,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const tools = [
  {
    title: "README Generator",
    description: "Generate comprehensive README files for your projects",
    icon: FileText,
    href: (repoId: string) => `/dashboard/${repoId}/readme-generator`,
    color: "text-blue-600",
  },
  {
    title: "Pull Request Analyzer",
    description: "Analyze and review pull requests with AI assistance",
    icon: GitPullRequest,
    href: (repoId: string) => `/dashboard/${repoId}/pr-analyzer`,
    color: "text-green-600",
  },
  {
    title: "Vulnerability Scanner",
    description: "Scan your code for security vulnerabilities",
    icon: Shield,
    href: (repoId: string) => `/dashboard/${repoId}/vulnerability-scanner`,
    color: "text-red-600",
  },
  {
    title: "Chat with Code",
    description: "Interactive AI assistant for your codebase",
    icon: MessageSquare,
    href: (repoId: string) => `/dashboard/${repoId}/chat-with-code`,
    color: "text-purple-600",
  },
  {
    title: "Deploy with Chat",
    description: "Deploy applications using natural language",
    icon: Rocket,
    href: (repoId: string) => `/dashboard/${repoId}/deploy-with-chat`,
    color: "text-orange-600",
  },
  {
    title: "Code Structure Visualization",
    description: "Visualize your project's architecture and dependencies",
    icon: Network,
    href: (repoId: string) => `/dashboard/${repoId}/code-structure`,
    color: "text-cyan-600",
  },
  {
    title: "Automated Testing",
    description: "Generate and run automated tests for your code",
    icon: TestTube,
    href: (repoId: string) => `/dashboard/${repoId}/automated-testing`,
    color: "text-yellow-600",
  },
  {
    title: "Environment Provisioning",
    description: "Set up development environments automatically",
    icon: Server,
    href: (repoId: string) => `/dashboard/${repoId}/environment-provisioning`,
    color: "text-indigo-600",
  },
];

// Dummy repository data
const dummyRepos = {
  "1": {
    name: "code-ai-platform",
    description: "An AI-powered code analysis and development platform",
    stars: 1234,
    forks: 567,
    language: "TypeScript",
    lastUpdated: "2 days ago",
  },
  "2": {
    name: "ml-model-trainer",
    description: "Machine learning model training and deployment toolkit",
    stars: 890,
    forks: 234,
    language: "Python",
    lastUpdated: "1 week ago",
  },
  "3": {
    name: "react-components",
    description: "Collection of reusable React components",
    stars: 567,
    forks: 123,
    language: "JavaScript",
    lastUpdated: "3 days ago",
  },
};

export default function DashboardPage({ params }: { params: { id: string } }) {
  const repo = dummyRepos[params.id as keyof typeof dummyRepos];

  if (!repo) {
    return (
      <SidebarProvider>
        <DevToolsSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="/dashboard"
                      className="hover:text-primary transition-colors"
                    >
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col items-center justify-center p-6">
            <h1 className="text-2xl font-bold">Repository Not Found</h1>
            <p className="text-muted-foreground mt-2">
              The repository you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider className="bg-grain">
      <DevToolsSidebar className="bg-grain" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12  bg-grain">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/dashboard"
                    className="hover:text-primary transition-colors"
                  >
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{repo.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 bg-grain">
          <div className="space-y-6 ">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{repo.name}</h1>
              <p className="text-muted-foreground mt-1.5">{repo.description}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{repo.stars.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GitFork className="h-4 w-4 text-blue-500" />
                  <span>{repo.forks.toLocaleString()}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium">
                  {repo.language}
                </span>
                <span className="text-xs">Updated {repo.lastUpdated}</span>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tools.map((tool) => (
                <Card
                  key={tool.title}
                  className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50"
                >
                  <a href={tool.href(params.id)} className="block">
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
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <GitBranch className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Repository Details
                </h1>
                <p className="text-muted-foreground mt-1.5">
                  Let&apos;s analyze your code and make it better
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                href={`/dashboard/${params.id}/chat-with-code`}
                className="block"
              >
                <Card className="group hover:border-primary/50 transition-all duration-200 hover:shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="group-hover:text-primary transition-colors text-lg">
                      Chat with Code
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      Ask questions about your code and get instant answers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        <span>AI Chat</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Code className="h-4 w-4 text-green-500" />
                        <span>Code Analysis</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link
                href={`/dashboard/${params.id}/pr-analyzer`}
                className="block"
              >
                <Card className="group hover:border-primary/50 transition-all duration-200 hover:shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="group-hover:text-primary transition-colors text-lg">
                      Pull Request Analyzer
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      Get AI-powered analysis of your pull requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <GitPullRequest className="h-4 w-4 text-purple-500" />
                        <span>PR Review</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Shield className="h-4 w-4 text-red-500" />
                        <span>Security Check</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link
                href={`/dashboard/${params.id}/automated-testing`}
                className="block"
              >
                <Card className="group hover:border-primary/50 transition-all duration-200 hover:shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="group-hover:text-primary transition-colors text-lg">
                      Automated Testing
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      Generate and run automated tests for your code
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <TestTube className="h-4 w-4 text-yellow-500" />
                        <span>Test Generation</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Play className="h-4 w-4 text-green-500" />
                        <span>Test Runner</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link
                href={`/dashboard/${params.id}/code-structure`}
                className="block"
              >
                <Card className="group hover:border-primary/50 transition-all duration-200 hover:shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="group-hover:text-primary transition-colors text-lg">
                      Code Structure
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      Visualize and analyze your codebase structure
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <GitBranch className="h-4 w-4 text-blue-500" />
                        <span>Dependency Graph</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FolderTree className="h-4 w-4 text-orange-500" />
                        <span>File Structure</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
