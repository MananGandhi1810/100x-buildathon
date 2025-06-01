"use client"

import { DevToolsSidebar } from "@/components/dev-tools-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TestTube, Plus, Clock, Play, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from "next/navigation"
import { Progress } from "@/components/ui/progress"

interface TestCase {
  id: string
  name: string
  status: "passed" | "failed" | "pending" | "running"
  duration: string
  error?: string
  code?: string
}

interface TestSuite {
  id: string
  name: string
  filePath: string
  language: string
  type: "unit" | "integration" | "e2e"
  status: "completed" | "running" | "failed" | "pending"
  coverage: number
  lastRun: string
  duration: string
  testCases: TestCase[]
  testCode: string
}

// Test data from the provided JSON
// const testData = {
//   "app/admin/page.js": {
//     language: "javascript",
//     test_cases:
//       "\"use client\";\nimport React from 'react';\nimport { render, screen, fireEvent, waitFor } from '@testing-library/react';\nimport '@testing-library/jest-dom';\nimport Admin from '../app/admin/page';\nimport * as authHelpers from '../lib/authHelpers';\nimport Dashboard from '@/components/admin/Dashboard';\n\njest.mock('../lib/authHelpers');\njest.mock('@/components/admin/Dashboard', () => () => <div data-testid=\"dashboard\">Dashboard</div>);\n\ndescribe('Admin Component', () => {\n  afterEach(() => {\n    jest.clearAllMocks();\n  });\n\n  it('renders login form initially', () => {\n    render(<Admin />);\n    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();\n    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();\n    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();\n  });\n\n  it('updates email and password on input change', () => {\n    render(<Admin />);\n    const emailInput = screen.getByPlaceholderText('Email');\n    const passwordInput = screen.getByPlaceholderText('Password');\n\n    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });\n    fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });\n\n    expect(emailInput.value).toBe('test@example.com');\n    expect(passwordInput.value).toBe('password123');\n  });\n\n  it('calls checkCredentials and displays success message on successful login', async () => {\n    authHelpers.checkCredentials.mockResolvedValue({ success: true, message: 'Login successful' });\n    render(<Admin />);\n    const emailInput = screen.getByPlaceholderText('Email');\n    const passwordInput = screen.getByPlaceholderText('Password');\n    const submitButton = screen.getByRole('button', { name: /submit/i });\n\n    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });\n    fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });\n    fireEvent.click(submitButton);\n\n    await waitFor(() => {\n      expect(authHelpers.checkCredentials).toHaveBeenCalledWith('test@example.com', 'password123');\n      expect(screen.getByTestId('dashboard')).toBeInTheDocument();\n    });\n  });\n\n  it('calls checkCredentials and displays error message on failed login', async () => {\n    authHelpers.checkCredentials.mockResolvedValue({ success: false, message: 'Invalid credentials' });\n    render(<Admin />);\n    const emailInput = screen.getByPlaceholderText('Email');\n    const passwordInput = screen.getByPlaceholderText('Password');\n    const submitButton = screen.getByRole('button', { name: /submit/i });\n\n    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });\n    fireEvent.change(passwordInput, { target: { name: 'password', value: 'wrongpassword' } });\n    fireEvent.click(submitButton);\n\n    await waitFor(() => {\n      expect(authHelpers.checkCredentials).toHaveBeenCalledWith('test@example.com', 'wrongpassword');\n      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();\n    });\n  });\n});",
//   },
//   "app/api/fetch-slots/route.js": {
//     language: "javascript",
//     test_cases:
//       "import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';\nimport { POST } from '@/app/api/route';\nimport supabase from '@/app/lib/supabase';\nimport { createMockSupabase } from './test-utils';\n\njest.mock('@/app/lib/supabase');\n\ndescribe('POST /api', () => {\n  beforeEach(() => {\n    supabase.from.mockClear();\n  });\n\n  afterEach(() => {\n    jest.restoreAllMocks();\n  });\n\n  it('should return 400 if date is missing', async () => {\n    const request = {\n      json: jest.fn().mockResolvedValue({}),\n    };\n    const response = await POST(request);\n    expect(response.status).toBe(400);\n    const data = await response.json();\n    expect(data.error).toBe('Date is required');\n  });\n\n  it('should return 500 if Supabase query fails', async () => {\n    const mockError = new Error('Supabase error');\n    const mockDate = '2024-01-01';\n    supabase.from.mockReturnValue({\n      select: jest.fn().mockReturnValue({\n        eq: jest.fn().mockReturnValue({\n          error: mockError,\n          data: null,\n        }),\n      }),\n    });\n\n    const request = {\n      json: jest.fn().mockResolvedValue({ date: mockDate }),\n    };\n    const response = await POST(request);\n    expect(response.status).toBe(500);\n    const data = await response.json();\n    expect(data.error).toBe(mockError.message);\n  });\n\n  it('should return 200 with frequency object if Supabase query succeeds', async () => {\n    const mockDate = '2024-01-01';\n    const mockSlots = [\n      { timeslot: '9:00', collectiondate: mockDate },\n      { timeslot: '9:00', collectiondate: mockDate },\n      { timeslot: '10:00', collectiondate: mockDate },\n    ];\n    supabase.from.mockReturnValue({\n      select: jest.fn().mockReturnValue({\n        eq: jest.fn().mockReturnValue({\n          data: mockSlots,\n          error: null,\n        }),\n      }),\n    });\n\n    const request = {\n      json: jest.fn().mockResolvedValue({ date: mockDate }),\n    };\n    const response = await POST(request);\n    expect(response.status).toBe(200);\n    const data = await response.json();\n    expect(data.freq).toEqual({ '9:00': 2, '10:00': 1 });\n  });\n\n  it('should return 500 for internal server error', async () => {\n    const request = {\n      json: jest.fn().mockRejectedValue(new Error('Internal server error')),\n    };\n    const response = await POST(request);\n    expect(response.status).toBe(500);\n    const data = await response.json();\n    expect(data.error).toBe('Internal server error');\n  });\n});",
//   },
// }

export default function AutomatedTestingPage() {
  const params = useParams<{ id: string }>()
  const [selectedTest, setSelectedTest] = useState<TestSuite | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "test-cases" | "coverage" | "code">("overview")
  const [testSuites, setTestSuites] = useState<TestSuite[]>([])
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTestData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/project/${params.id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch test data")
        }

        const data = await response.json()

        // Convert API response to test suites format
        const suites: TestSuite[] = Object.entries(data.data.aiAnalysis.tests || {}).map(
          ([filePath, testData]: [string, any], index) => {
            const testCases = extractTestCases(testData.test_cases)
            const passedTests = testCases.filter((tc) => tc.status === "passed").length
            const failedTests = testCases.filter((tc) => tc.status === "failed").length

            return {
              id: `suite-${index}`,
              name:
                filePath
                  .split("/")
                  .pop()
                  ?.replace(/\.(js|ts|jsx|tsx)$/, "") || "Unknown",
              filePath,
              language: testData.language,
              type: filePath.includes("/api/") ? "integration" : filePath.includes("components") ? "unit" : "unit",
              status: failedTests > 0 ? "failed" : "completed",
              coverage: Math.floor(Math.random() * 30) + 70, // This should come from API in real implementation
              lastRun: `${Math.floor(Math.random() * 24)} hours ago`,
              duration: `${Math.floor(Math.random() * 120) + 10}s`,
              testCases,
              testCode: testData.test_cases,
            }
          },
        )

        setTestSuites(suites)
        if (suites.length > 0) {
          setSelectedTest(suites[0])
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching test data:", error)
        setError("Failed to load test data")
        setTestSuites([])
        setLoading(false)
      }
    }

    fetchTestData()
  }, [params.id])

  const extractTestCases = (testCode: string): TestCase[] => {
    const testCases: TestCase[] = []
    const lines = testCode.split("\n")
    let testId = 1

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith("it('") || trimmed.startsWith('it("')) {
        const testName = trimmed.match(/it\(['"](.+?)['"],/)?.[1] || "Unknown test"
        const status = Math.random() > 0.8 ? "failed" : "passed"

        testCases.push({
          id: `test-${testId}`,
          name: testName,
          status: status as "passed" | "failed",
          duration: `${(Math.random() * 2).toFixed(1)}s`,
          error: status === "failed" ? "Assertion failed: Expected value to be truthy" : undefined,
        })
        testId++
      }
    }

    return testCases
  }

  const runTestSuite = async (suiteId: string) => {
    setRunningTests((prev) => new Set([...prev, suiteId]))

    // Simulate test run
    setTimeout(() => {
      setTestSuites((prev) =>
        prev.map((suite) => (suite.id === suiteId ? { ...suite, status: "completed", lastRun: "Just now" } : suite)),
      )
      setRunningTests((prev) => {
        const newSet = new Set(prev)
        newSet.delete(suiteId)
        return newSet
      })
    }, 3000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "running":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getTestCaseIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "running":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <SidebarProvider className="bg-grain">
      <DevToolsSidebar id={params.id} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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
                  <BreadcrumbPage>Automated Testing</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                  <TestTube className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Automated Testing</h1>
                  <p className="text-muted-foreground mt-1.5">Generate and run automated tests for your code</p>
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
                  <CardDescription>Select a test suite to view details</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    {loading ? (
                      <div className="flex items-center justify-center h-32">
                        <Clock className="h-6 w-6 animate-spin" />
                        <span className="ml-2">Loading tests...</span>
                      </div>
                    ) : error ? (
                      <div className="flex items-center justify-center h-32 text-destructive">
                        <AlertCircle className="h-6 w-6" />
                        <span className="ml-2">{error}</span>
                      </div>
                    ) : testSuites.length === 0 ? (
                      <div className="flex items-center justify-center h-32 text-muted-foreground">
                        <TestTube className="h-6 w-6" />
                        <span className="ml-2">No tests found</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {testSuites.map((test) => (
                          <div
                            key={test.id}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedTest?.id === test.id
                                ? "bg-primary/10 border border-primary/20"
                                : "hover:bg-muted/50"
                              }`}
                            onClick={() => setSelectedTest(test)}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium">{test.name}</h3>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(test.status)}
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
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="capitalize">{test.type}</span>
                              <span>•</span>
                              <span>{test.coverage}% coverage</span>
                              <span>•</span>
                              <span>{test.lastRun}</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">{test.filePath}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  runTestSuite(test.id)
                                }}
                                disabled={runningTests.has(test.id)}
                              >
                                {runningTests.has(test.id) ? (
                                  <Clock className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Play className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Test Details */}
              <Card className="col-span-8">
                <CardHeader>
                  <CardTitle>Test Details</CardTitle>
                  <CardDescription>
                    {selectedTest?.status === "completed"
                      ? "View test results and coverage"
                      : "Test suite is running..."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    {selectedTest ? (
                      <div className="space-y-6">
                        <Tabs
                          defaultValue="overview"
                          value={activeTab}
                          onValueChange={(value) =>
                            setActiveTab(value as "overview" | "test-cases" | "coverage" | "code")
                          }
                        >
                          <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
                            <TabsTrigger value="coverage">Coverage</TabsTrigger>
                            <TabsTrigger value="code">Test Code</TabsTrigger>
                          </TabsList>

                          <TabsContent value="overview" className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Total Tests</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold">{selectedTest.testCases.length}</div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Passed</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold text-green-500">
                                    {selectedTest.testCases.filter((tc) => tc.status === "passed").length}
                                  </div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Failed</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold text-red-500">
                                    {selectedTest.testCases.filter((tc) => tc.status === "failed").length}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            <Card>
                              <CardHeader>
                                <CardTitle>Test Suite Information</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">File Path:</span>
                                  <span className="text-sm font-mono">{selectedTest.filePath}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Language:</span>
                                  <span className="text-sm">{selectedTest.language}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Type:</span>
                                  <span className="text-sm capitalize">{selectedTest.type}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Duration:</span>
                                  <span className="text-sm">{selectedTest.duration}</span>
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>

                          <TabsContent value="test-cases" className="space-y-4">
                            <div className="space-y-2">
                              {selectedTest.testCases.map((testCase) => (
                                <Card key={testCase.id}>
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        {getTestCaseIcon(testCase.status)}
                                        <div>
                                          <h4 className="font-medium">{testCase.name}</h4>
                                          <p className="text-sm text-muted-foreground">Duration: {testCase.duration}</p>
                                        </div>
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
                                      <p className="mt-2 text-sm text-destructive bg-destructive/10 p-2 rounded">
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
                                <CardDescription>Overall test coverage for this test suite</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Total Coverage</span>
                                    <span className="text-lg font-medium">{selectedTest.coverage}%</span>
                                  </div>
                                  <Progress value={selectedTest.coverage} className="w-full" />

                                  <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Lines:</span>
                                        <span className="text-sm">{selectedTest.coverage}%</span>
                                      </div>
                                      <Progress value={selectedTest.coverage} className="h-2" />
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Functions:</span>
                                        <span className="text-sm">{Math.max(selectedTest.coverage - 5, 0)}%</span>
                                      </div>
                                      <Progress value={Math.max(selectedTest.coverage - 5, 0)} className="h-2" />
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>

                          <TabsContent value="code" className="space-y-4">
                            <Card>
                              <CardHeader>
                                <CardTitle>Test Code</CardTitle>
                                <CardDescription>View the complete test code for this suite</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-96">
                                  <code>{selectedTest.testCode}</code>
                                </pre>
                              </CardContent>
                            </Card>
                          </TabsContent>
                        </Tabs>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center space-y-2">
                          <TestTube className="h-8 w-8 text-muted-foreground mx-auto" />
                          <p className="text-muted-foreground">Select a test suite to view details</p>
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
