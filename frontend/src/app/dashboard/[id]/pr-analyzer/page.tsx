"use client";

import { DevToolsSidebar } from "@/components/dev-tools-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { GitPullRequest, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

// Add proper types for PR analysis
interface PRAnalysis {
  status: "completed" | "in_progress";
  summary: string;
  suggestions?: string[];
  security?: {
    issues: number;
    warnings: number;
  };
  performance?: {
    impact: "high" | "medium" | "low" | "none";
    suggestions: string[];
  };
}

interface PR {
  id: number;
  title: string;
  author: string;
  status: "open" | "merged" | "closed";
  changes: {
    files: number;
    additions: number;
    deletions: number;
  };
  lastUpdated: string;
  analysis: PRAnalysis;
}

// Update dummy data with proper types
const dummyPRs: PR[] = [
  {
    id: 1,
    title: "Add authentication middleware",
    author: "john_doe",
    status: "open",
    changes: {
      files: 5,
      additions: 120,
      deletions: 45,
    },
    lastUpdated: "2 hours ago",
    analysis: {
      status: "completed",
      summary:
        "The PR looks good overall with minor suggestions for improvement.",
      suggestions: [
        "Consider adding input validation for the email field",
        "Add error handling for database connection failures",
        "Update documentation to reflect the new authentication flow",
      ],
      security: {
        issues: 0,
        warnings: 2,
      },
      performance: {
        impact: "low",
        suggestions: ["Consider caching user sessions"],
      },
    },
  },
  {
    id: 2,
    title: "Implement user profile page",
    author: "jane_smith",
    status: "open",
    changes: {
      files: 8,
      additions: 230,
      deletions: 90,
    },
    lastUpdated: "1 day ago",
    analysis: {
      status: "in_progress",
      summary: "Analysis in progress...",
    },
  },
  {
    id: 3,
    title: "Fix navigation bug in mobile view",
    author: "alex_wilson",
    status: "merged",
    changes: {
      files: 3,
      additions: 45,
      deletions: 20,
    },
    lastUpdated: "3 days ago",
    analysis: {
      status: "completed",
      summary: "The PR has been successfully merged with no issues.",
      suggestions: [],
      security: {
        issues: 0,
        warnings: 0,
      },
      performance: {
        impact: "none",
        suggestions: [],
      },
    },
  },
];

export default function PRAnalyzerPage({ params }: { params: { id: string } }) {
  const [selectedPR, setSelectedPR] = useState<PR>(dummyPRs[0]);

  const renderSuggestions = () => {
    if (!selectedPR.analysis.suggestions?.length) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <h3 className="font-medium">Suggestions</h3>
        </div>
        <ul className="space-y-2">
          {selectedPR.analysis.suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderSecurityMetrics = () => {
    if (!selectedPR.analysis.security) return null;

    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Security</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Issues</span>
              <Badge
                variant={
                  (selectedPR.analysis.security.issues ?? 0) > 0
                    ? "destructive"
                    : "default"
                }
              >
                {selectedPR.analysis.security.issues}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Warnings</span>
              <Badge
                variant={
                  (selectedPR.analysis.security.warnings ?? 0) > 0
                    ? "secondary"
                    : "default"
                }
              >
                {selectedPR.analysis.security.warnings}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPerformanceMetrics = () => {
    if (!selectedPR.analysis.performance) return null;

    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Impact</span>
              <Badge
                variant={
                  selectedPR.analysis.performance.impact === "high"
                    ? "destructive"
                    : selectedPR.analysis.performance.impact === "medium"
                    ? "secondary"
                    : "default"
                }
              >
                {selectedPR.analysis.performance.impact}
              </Badge>
            </div>
            {selectedPR.analysis.performance.suggestions?.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {selectedPR.analysis.performance.suggestions[0]}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <SidebarProvider>
      <DevToolsSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-grain">
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
                  <BreadcrumbLink
                    href={`/dashboard/${params.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    Repository
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Pull Request Analyzer</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 bg-grain">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <GitPullRequest className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Pull Request Analyzer
                </h1>
                <p className="text-muted-foreground mt-1.5">
                  Analyze and review pull requests with AI assistance
                </p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* PR List */}
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Pull Requests</CardTitle>
                  <CardDescription>Select a PR to analyze</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="space-y-2">
                      {dummyPRs.map((pr) => (
                        <div
                          key={pr.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedPR.id === pr.id
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedPR(pr)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium">{pr.title}</h3>
                            <Badge
                              variant={
                                pr.status === "merged"
                                  ? "default"
                                  : pr.status === "open"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {pr.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>@{pr.author}</span>
                            <span>•</span>
                            <span>{pr.changes.files} files</span>
                            <span>•</span>
                            <span>{pr.lastUpdated}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* PR Analysis */}
              <Card className="col-span-8">
                <CardHeader>
                  <CardTitle>PR Analysis</CardTitle>
                  <CardDescription>
                    {selectedPR.analysis.status === "completed"
                      ? "AI-powered analysis of the selected pull request"
                      : "Analysis in progress..."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="space-y-6">
                      {selectedPR.analysis.status === "completed" ? (
                        <>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                              <h3 className="font-medium">Summary</h3>
                            </div>
                            <p className="text-muted-foreground">
                              {selectedPR.analysis.summary}
                            </p>
                          </div>

                          {renderSuggestions()}

                          <div className="grid grid-cols-2 gap-4">
                            {renderSecurityMetrics()}
                            {renderPerformanceMetrics()}
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center space-y-2">
                            <Clock className="h-8 w-8 text-muted-foreground animate-spin" />
                            <p className="text-muted-foreground">
                              Analyzing pull request...
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
