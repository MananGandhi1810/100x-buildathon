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
import {
  GitBranch,
  FileCode,
  Folder,
  ChevronRight,
  ChevronDown,
  GitFork,
  BarChart3,
  Layers,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Add proper types for the tree structure
interface FileNode {
  name: string;
  type: "file" | "directory";
  size?: string;
  complexity?: number;
  children?: FileNode[];
}

interface Dependency {
  source: string;
  target: string;
  type: string;
}

interface Metrics {
  totalFiles: number;
  totalLines: number;
  averageComplexity: number;
  largestFile: string;
  mostComplexFile: string;
  fileTypes: Record<string, number>;
}

// Update the dummy data with proper types
const dummyStructure: FileNode = {
  name: "frontend",
  type: "directory",
  children: [
    {
      name: "src",
      type: "directory",
      children: [
        {
          name: "app",
          type: "directory",
          children: [
            {
              name: "dashboard",
              type: "directory",
              children: [
                {
                  name: "page.tsx",
                  type: "file",
                  size: "2.3KB",
                  complexity: 3,
                },
                {
                  name: "layout.tsx",
                  type: "file",
                  size: "1.8KB",
                  complexity: 2,
                },
              ],
            },
            { name: "globals.css", type: "file", size: "4.2KB", complexity: 1 },
          ],
        },
        {
          name: "components",
          type: "directory",
          children: [
            { name: "ui", type: "directory", children: [] },
            {
              name: "dev-tools-sidebar.tsx",
              type: "file",
              size: "3.1KB",
              complexity: 4,
            },
          ],
        },
      ],
    },
    {
      name: "public",
      type: "directory",
      children: [
        { name: "logo.svg", type: "file", size: "1.2KB", complexity: 1 },
      ],
    },
  ],
};

const dummyDependencies: Dependency[] = [
  {
    source: "dashboard/page.tsx",
    target: "components/dev-tools-sidebar.tsx",
    type: "import",
  },
  {
    source: "dashboard/page.tsx",
    target: "components/ui/button.tsx",
    type: "import",
  },
  {
    source: "components/dev-tools-sidebar.tsx",
    target: "components/ui/sidebar.tsx",
    type: "import",
  },
];

const dummyMetrics: Metrics = {
  totalFiles: 24,
  totalLines: 1250,
  averageComplexity: 2.8,
  largestFile: "app/globals.css",
  mostComplexFile: "components/dev-tools-sidebar.tsx",
  fileTypes: {
    ".tsx": 12,
    ".ts": 8,
    ".css": 3,
    ".svg": 1,
  },
};

export default function CodeStructurePage({
  params,
}: {
  params: { id: string };
}) {
  const [activeTab, setActiveTab] = useState("structure");
  const [expandedNodes, setExpandedNodes] = useState(
    new Set(["frontend", "src"])
  );

  const toggleNode = (nodeName: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeName)) {
      newExpanded.delete(nodeName);
    } else {
      newExpanded.add(nodeName);
    }
    setExpandedNodes(newExpanded);
  };

  const renderTree = (node: FileNode, level = 0) => {
    const isExpanded = expandedNodes.has(node.name);
    const isDirectory = node.type === "directory";

    return (
      <div key={node.name} style={{ marginLeft: `${level * 20}px` }}>
        <div
          className="flex items-center gap-2 py-1 hover:bg-muted/50 rounded-md cursor-pointer"
          onClick={() => isDirectory && toggleNode(node.name)}
        >
          {isDirectory ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : null}
          {isDirectory ? (
            <Folder className="h-4 w-4 text-blue-500" />
          ) : (
            <FileCode className="h-4 w-4 text-green-500" />
          )}
          <span className="text-sm">{node.name}</span>
          {!isDirectory && (
            <div className="flex items-center gap-2 ml-auto text-xs text-muted-foreground">
              <span>{node.size}</span>
              <Badge variant="outline">Complexity: {node.complexity}</Badge>
            </div>
          )}
        </div>
        {isDirectory &&
          isExpanded &&
          node.children?.map((child) => renderTree(child, level + 1))}
      </div>
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
                  <BreadcrumbPage>Code Structure</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 bg-grain">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <GitBranch className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Code Structure
                  </h1>
                  <p className="text-muted-foreground mt-1.5">
                    Visualize and analyze your codebase structure
                  </p>
                </div>
              </div>
              <Button className="gap-2">
                <GitFork className="h-4 w-4" />
                Analyze Dependencies
              </Button>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Code Structure Tree */}
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Directory Structure</CardTitle>
                  <CardDescription>
                    Browse your codebase structure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    {renderTree(dummyStructure)}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Details Panel */}
              <Card className="col-span-8">
                <CardHeader>
                  <CardTitle>Code Analysis</CardTitle>
                  <CardDescription>
                    View detailed metrics and relationships
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-4"
                  >
                    <TabsList>
                      <TabsTrigger value="structure">Structure</TabsTrigger>
                      <TabsTrigger value="dependencies">
                        Dependencies
                      </TabsTrigger>
                      <TabsTrigger value="metrics">Metrics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="structure" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                              Total Files
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {dummyMetrics.totalFiles}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                              Total Lines
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {dummyMetrics.totalLines}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <Card>
                        <CardHeader>
                          <CardTitle>File Types</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {Object.entries(dummyMetrics.fileTypes).map(
                              ([type, count]) => (
                                <div
                                  key={type}
                                  className="flex items-center justify-between"
                                >
                                  <span className="text-sm">{type}</span>
                                  <Badge>{count} files</Badge>
                                </div>
                              )
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="dependencies" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Module Dependencies</CardTitle>
                          <CardDescription>
                            Import relationships between files
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {dummyDependencies.map((dep, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-4"
                              >
                                <FileCode className="h-4 w-4 text-blue-500" />
                                <span className="text-sm">{dep.source}</span>
                                <Layers className="h-4 w-4 text-muted-foreground" />
                                <FileCode className="h-4 w-4 text-green-500" />
                                <span className="text-sm">{dep.target}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="metrics" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                              Average Complexity
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {dummyMetrics.averageComplexity}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                              Most Complex File
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm truncate">
                              {dummyMetrics.mostComplexFile}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <Card>
                        <CardHeader>
                          <CardTitle>Code Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                            <BarChart3 className="h-8 w-8" />
                            <span className="ml-2">
                              Code distribution chart will be displayed here
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
