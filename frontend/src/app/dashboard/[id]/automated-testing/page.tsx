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
import { Button } from "@/components/ui/button";
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
import { TestTube, Plus, Clock } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TestCase {
  id: string;
  name: string;
  status: "passed" | "failed" | "pending";
  duration: string;
  error?: string;
}

interface TestSuite {
  id: string;
  name: string;
  type: "unit" | "integration" | "e2e";
  status: "completed" | "running" | "failed";
  coverage: number;
  lastRun: string;
  duration: string;
  testCases: TestCase[];
}

// Dummy test data
const dummyTests: TestSuite[] = [
  {
    id: "1",
    name: "Authentication Tests",
    type: "unit",
    status: "completed",
    coverage: 85,
    lastRun: "2 hours ago",
    duration: "45s",
    testCases: [
      {
        id: "1-1",
        name: "User login with valid credentials",
        status: "passed",
        duration: "0.5s",
      },
      {
        id: "1-2",
        name: "User login with invalid credentials",
        status: "passed",
        duration: "0.3s",
      },
      {
        id: "1-3",
        name: "Password reset flow",
        status: "failed",
        duration: "1.2s",
        error: "Email service not responding",
      },
    ],
  },
  {
    id: "2",
    name: "API Integration Tests",
    type: "integration",
    status: "running",
    coverage: 0,
    lastRun: "Just now",
    duration: "0s",
    testCases: [],
  },
  {
    id: "3",
    name: "End-to-End Tests",
    type: "e2e",
    status: "completed",
    coverage: 72,
    lastRun: "1 day ago",
    duration: "2m 30s",
    testCases: [
      {
        id: "3-1",
        name: "Complete user registration flow",
        status: "passed",
        duration: "15s",
      },
      {
        id: "3-2",
        name: "Product checkout process",
        status: "passed",
        duration: "20s",
      },
    ],
  },
];

interface PageProps {
  params: {
    id: string;
  };
}

export default function AutomatedTestingPage({ params }: PageProps) {
  const [selectedTest, setSelectedTest] = useState<TestSuite>(dummyTests[0]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "test-cases" | "coverage"
  >("overview");

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
                  <BreadcrumbPage>Automated Testing</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 bg-grain">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                  <TestTube className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Automated Testing
                  </h1>
                  <p className="text-muted-foreground mt-1.5">
                    Generate and run automated tests for your code
                  </p>
                </div>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Generate Tests
              </Button>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Test List */}
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Test Suites</CardTitle>
                  <CardDescription>
                    Select a test suite to view details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="space-y-2">
                      {dummyTests.map((test) => (
                        <div
                          key={test.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedTest.id === test.id
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedTest(test)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium">{test.name}</h3>
                            <Badge
                              variant={
                                test.status === "completed"
                                  ? "default"
                                  : test.status === "running"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {test.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="capitalize">{test.type}</span>
                            <span>•</span>
                            <span>{test.coverage}% coverage</span>
                            <span>•</span>
                            <span>{test.lastRun}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Test Details */}
              <Card className="col-span-8">
                <CardHeader>
                  <CardTitle>Test Details</CardTitle>
                  <CardDescription>
                    {selectedTest.status === "completed"
                      ? "View test results and coverage"
                      : "Test suite is running..."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="space-y-6">
                      {selectedTest.status === "completed" ? (
                        <>
                          <Tabs
                            defaultValue="overview"
                            value={activeTab}
                            onValueChange={(value) =>
                              setActiveTab(
                                value as "overview" | "test-cases" | "coverage"
                              )
                            }
                          >
                            <TabsList>
                              <TabsTrigger value="overview">
                                Overview
                              </TabsTrigger>
                              <TabsTrigger value="test-cases">
                                Test Cases
                              </TabsTrigger>
                              <TabsTrigger value="coverage">
                                Coverage
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-4">
                              <div className="grid grid-cols-3 gap-4">
                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">
                                      Total Tests
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-2xl font-bold">
                                      {selectedTest.testCases.length}
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">
                                      Passed
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-2xl font-bold text-green-500">
                                      {
                                        selectedTest.testCases.filter(
                                          (tc) => tc.status === "passed"
                                        ).length
                                      }
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">
                                      Failed
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-2xl font-bold text-red-500">
                                      {
                                        selectedTest.testCases.filter(
                                          (tc) => tc.status === "failed"
                                        ).length
                                      }
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </TabsContent>

                            <TabsContent
                              value="test-cases"
                              className="space-y-4"
                            >
                              <div className="space-y-2">
                                {selectedTest.testCases.map((testCase) => (
                                  <Card key={testCase.id}>
                                    <CardContent className="p-4">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <h4 className="font-medium">
                                            {testCase.name}
                                          </h4>
                                          <p className="text-sm text-muted-foreground">
                                            Duration: {testCase.duration}
                                          </p>
                                        </div>
                                        <Badge
                                          variant={
                                            testCase.status === "passed"
                                              ? "default"
                                              : testCase.status === "failed"
                                              ? "destructive"
                                              : "secondary"
                                          }
                                        >
                                          {testCase.status}
                                        </Badge>
                                      </div>
                                      {testCase.error && (
                                        <p className="mt-2 text-sm text-destructive">
                                          {testCase.error}
                                        </p>
                                      )}
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </TabsContent>

                            <TabsContent value="coverage" className="space-y-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle>Code Coverage</CardTitle>
                                  <CardDescription>
                                    Overall test coverage for this test suite
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-muted-foreground">
                                        Total Coverage
                                      </span>
                                      <span className="text-lg font-medium">
                                        {selectedTest.coverage}%
                                      </span>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-primary transition-all duration-500"
                                        style={{
                                          width: `${selectedTest.coverage}%`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </TabsContent>
                          </Tabs>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center space-y-2">
                            <Clock className="h-8 w-8 text-muted-foreground animate-spin" />
                            <p className="text-muted-foreground">
                              Running test suite...
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
