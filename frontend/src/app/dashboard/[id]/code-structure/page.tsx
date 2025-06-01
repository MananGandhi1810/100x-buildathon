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
import { GitBranch, FileCode, GitFork, Layers, Clock, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Suspense } from "react"
import mermaid from "mermaid";
interface FileNode {
  name: string
  type: "file" | "directory"
  size?: string
  complexity?: number
  fileType?: string
  children?: FileNode[]
}

interface Dependency {
  source: string
  target: string
  type: string
}

interface Metrics {
  totalFiles: number
  totalLines: number
  averageComplexity: number
  largestFile: string
  mostComplexFile: string
  fileTypes: Record<string, number>
}

const MermaidChart = ({ chartData }: { chartData: string }) => {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "inherit",
    })
    mermaid.contentLoaded()
  }, [chartData])

  return (
    <div className="w-full overflow-x-auto p-4">
      <pre className="mermaid">{chartData}</pre>
    </div>
  )
}

export default function CodeStructurePage() {
  const params = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState("mermaid")
  const [expandedNodes, setExpandedNodes] = useState(new Set(["railway-concession", "app", "components"]))
  const [mermaidChart, setMermaidChart] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock data for other tabs (you can replace with API data later)
  const dependencies: Dependency[] = [
    { source: "app/page.js", target: "components/Header.jsx", type: "import" },
    { source: "app/page.js", target: "components/Footer.jsx", type: "import" },
    { source: "app/page.js", target: "app/data/data.js", type: "import" },
    { source: "app/admin/page.js", target: "components/admin/Dashboard.js", type: "import" },
    { source: "app/admin/page.js", target: "app/lib/authHelpers.js", type: "import" },
    { source: "app/api/submit-form/route.js", target: "app/lib/supabase.js", type: "import" },
    { source: "app/api/fetch-slots/route.js", target: "app/lib/supabase.js", type: "import" },
    { source: "components/admin/Dashboard.js", target: "app/lib/supabase.js", type: "import" },
    { source: "app/lib/authHelpers.js", target: "app/lib/supabase.js", type: "import" },
    { source: "components/Header.jsx", target: "components/ui/button.jsx", type: "import" },
    { source: "components/admin/Dashboard.js", target: "components/ui/card.jsx", type: "import" },
  ]

  const metrics: Metrics = {
    totalFiles: 32,
    totalLines: 2847,
    averageComplexity: 2.1,
    largestFile: "pnpm-lock.yaml",
    mostComplexFile: "app/page.js",
    fileTypes: {
      ".js": 12,
      ".jsx": 8,
      ".svg": 5,
      ".json": 3,
      ".css": 1,
      ".png": 1,
      ".ico": 1,
      ".md": 1,
    },
  }

  useEffect(() => {
    const fetchMermaidChart = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/project/${params.id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch code structure")
        }

        const data = await response.json()
        console.log("Mermaid chart data:", data.data.diagram)
        setMermaidChart(data.data.diagram || "")
        setLoading(false)
      } catch (error) {
        console.error("Error fetching mermaid chart:", error)
        setError("Failed to load code structure")
        setLoading(false)
      }
    }

    fetchMermaidChart()
  }, [params.id])

  const toggleNode = (nodeName: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeName)) {
      newExpanded.delete(nodeName)
    } else {
      newExpanded.add(nodeName)
    }
    setExpandedNodes(newExpanded)
  }

  // Clean the chart data similar to the reference code
  const cleanedChartData = mermaidChart?.replace(/\\n/g, "\n").replace(/[()/]/g, "") || ""

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
                  <BreadcrumbPage>Code Structure</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <GitBranch className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Code Structure</h1>
                  <p className="text-muted-foreground mt-1.5">Visualize and analyze your codebase structure</p>
                </div>
              </div>
              <Button className="gap-2">
                <GitFork className="h-4 w-4" />
                Analyze Dependencies
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Code Analysis</CardTitle>
                <CardDescription>View detailed structure and relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="mermaid">Structure Diagram</TabsTrigger>
                    <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="mermaid" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Project Structure Diagram</CardTitle>
                        <CardDescription>Visual representation of your codebase structure</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <div className="flex items-center justify-center h-64">
                            <Clock className="h-6 w-6 animate-spin mr-2" />
                            <span>Loading structure diagram...</span>
                          </div>
                        ) : error ? (
                          <div className="flex items-center justify-center h-64 text-destructive">
                            <AlertCircle className="h-6 w-6 mr-2" />
                            <span>{error}</span>
                          </div>
                        ) : cleanedChartData ? (
                          <Suspense
                            fallback={<div className="flex items-center justify-center h-64">Loading chart...</div>}
                          >
                            <ScrollArea className="h-[600px] w-full">
                              <MermaidChart chartData={cleanedChartData} />
                            </ScrollArea>
                          </Suspense>
                        ) : (
                          <div className="flex items-center justify-center h-64 text-muted-foreground">
                            <GitBranch className="h-6 w-6 mr-2" />
                            <span>No structure diagram available</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="dependencies" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Module Dependencies</CardTitle>
                        <CardDescription>Import relationships between files</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px]">
                          <div className="space-y-3">
                            {dependencies.map((dep, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                                <FileCode className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                <span className="text-sm font-mono flex-1 truncate">{dep.source}</span>
                                <Layers className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <FileCode className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm font-mono flex-1 truncate">{dep.target}</span>
                                <Badge variant="outline" className="text-xs">
                                  {dep.type}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="metrics" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Total Files</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{metrics.totalFiles}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Total Lines</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{metrics.totalLines.toLocaleString()}</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>File Types Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(metrics.fileTypes).map(([type, count]) => {
                            const percentage = (count / metrics.totalFiles) * 100
                            return (
                              <div key={type} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span>{type}</span>
                                  <span>
                                    {count} files ({percentage.toFixed(1)}%)
                                  </span>
                                </div>
                                <Progress value={percentage} className="h-2" />
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Average Complexity</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{metrics.averageComplexity}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Code Quality</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-500">Good</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Complexity Distribution</CardTitle>
                        <CardDescription>Files by complexity level</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>Low Complexity (1-2)</span>
                              <span>18 files (56%)</span>
                            </div>
                            <Progress value={56} className="h-2" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>Medium Complexity (3-4)</span>
                              <span>11 files (34%)</span>
                            </div>
                            <Progress value={34} className="h-2" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>High Complexity (5+)</span>
                              <span>3 files (10%)</span>
                            </div>
                            <Progress value={10} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Architecture Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Frontend Framework:</span>
                              <span>Next.js</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Database:</span>
                              <span>Supabase</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Styling:</span>
                              <span>CSS/Tailwind</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">API Routes:</span>
                              <span>2</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Components:</span>
                              <span>10</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Pages:</span>
                              <span>3</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
