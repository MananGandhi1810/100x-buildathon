"use client";
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { FileText, Download, Copy } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from 'next/navigation'
import axios from "axios"
import ReactMarkdown from "react-markdown";

export default function ReadmeGeneratorPage() {
  const [projectData, setProjectData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const params = useParams<{ id: string }>();
  const repoSlug = params.id;

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/project/${repoSlug}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        });
        console.log("Project data response:", response.data.data);
        setProjectData(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [params.id]);

  return (
    <SidebarProvider>
      <DevToolsSidebar id={params.id} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-grain">
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
                  <BreadcrumbPage>README Generator</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-grain">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">README Generator</h1>
                <p className="text-muted-foreground">Generate comprehensive README files for your projects</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              

              <Card>
                <CardHeader>
                  <CardTitle>Generated README</CardTitle>
                  <CardDescription>Your generated README will appear here</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[400px] rounded-md border bg-muted/50 p-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-foreground">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 text-foreground">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-lg font-medium mb-2 text-foreground">{children}</h3>,
                          p: ({ children }) => <p className="mb-3 text-foreground leading-relaxed">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="text-foreground">{children}</li>,
                          code: ({ children, className }) => {
                            const isInline = !className
                            if (isInline) {
                              return <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
                            }
                            return (
                              <pre className="bg-muted p-3 rounded-md overflow-x-auto mb-3">
                                <code className="text-sm font-mono">{children}</code>
                              </pre>
                            )
                          },
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-muted-foreground pl-4 italic mb-3 text-muted-foreground">
                              {children}
                            </blockquote>
                          ),
                          a: ({ children, href }) => (
                            <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                              {children}
                            </a>
                          ),
                          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                          em: ({ children }) => <em className="italic text-foreground">{children}</em>,
                        }}
                      >
                        {projectData?.readme || "Your README content will be generated here."}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
