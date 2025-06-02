"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Play,
  Square,
  RefreshCw,
  ExternalLink,
  Server,
  GitBranch,
  Clock,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { DevToolsSidebar } from "@/components/dev-tools-sidebar";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface EnvSecret {
  key: string;
  value: string;
}

interface Deployment {
  id: string;
  name: string;
  description?: string;
  framework: string;
  githubUrl: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
  envSecrets?: EnvSecret[];
  containerId?: string;
  containerPort?: number;
}

export default function DeploymentDetailPage() {
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    fetchDeployment();
  }, [params.id]);

  const fetchDeployment = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/deploy/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDeployment(response.data.data.deployment);
    } catch (error) {
      toast.error("Failed to fetch deployment details");
      router.push("/deployments");
    } finally {
      setLoading(false);
    }
  };

  const refreshStatus = async () => {
    if (!deployment) return;

    setStatusLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/deploy/${deployment.id}/status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDeployment((prev) =>
        prev ? { ...prev, status: response.data.data.status } : null
      );
    } catch (error) {
      toast.error("Failed to refresh status");
    } finally {
      setStatusLoading(false);
    }
  };

  const startDeployment = async () => {
    if (!deployment) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/deploy/${deployment.id}/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Deployment started successfully");
      refreshStatus();
    } catch (error) {
      toast.error("Failed to start deployment");
    }
  };

  const stopDeployment = async () => {
    if (!deployment) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/deploy/${deployment.id}/stop`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Deployment stopped successfully");
      refreshStatus();
    } catch (error) {
      toast.error("Failed to stop deployment");
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-green-100 text-green-800">Running</Badge>;
      case "stopped":
        return <Badge variant="secondary">Stopped</Badge>;
      case "exited":
        return <Badge variant="destructive">Exited</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <DevToolsSidebar id={params.id as string} />
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
                    <BreadcrumbLink
                      href="/deployments"
                      className="hover:text-primary transition-colors"
                    >
                      Deployments
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Deployment Details</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-6 p-6 bg-grain">
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">
                Loading deployment details...
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!deployment) {
    return (
      <SidebarProvider>
        <DevToolsSidebar id={params.id as string} />
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
                    <BreadcrumbLink
                      href="/deployments"
                      className="hover:text-primary transition-colors"
                    >
                      Deployments
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Deployment Details</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-6 p-6 bg-grain">
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Deployment not found</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <DevToolsSidebar id={params.id as string} />
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
                  <BreadcrumbLink
                    href="/deployments"
                    className="hover:text-primary transition-colors"
                  >
                    Deployments
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Deployment Details</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 bg-grain">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight">
                    {deployment.name}
                  </h1>
                  {getStatusBadge(deployment.status)}
                </div>
                <p className="text-muted-foreground">
                  {deployment.description || "No description"}
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Deployment Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(deployment.status)}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={refreshStatus}
                        disabled={statusLoading}
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${
                            statusLoading ? "animate-spin" : ""
                          }`}
                        />
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Framework</span>
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4" />
                      <span className="text-sm">{deployment.framework}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Created</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        {new Date(deployment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Updated</span>
                    <span className="text-sm">
                      {new Date(deployment.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {deployment.containerPort && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Container Port
                        </span>
                        <span className="text-sm">
                          {deployment.containerPort}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                  <CardDescription>Manage your deployment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={startDeployment}
                      disabled={deployment.status === "running"}
                      className="flex-1"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                    <Button
                      variant="outline"
                      onClick={stopDeployment}
                      disabled={deployment.status !== "running"}
                      className="flex-1"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <a
                      href={deployment.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on GitHub
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {deployment.envSecrets && deployment.envSecrets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Environment Variables
                  </CardTitle>
                  <CardDescription>
                    Environment variables configured for this deployment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {deployment.envSecrets.map((secret, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <span className="font-mono text-sm">{secret.key}</span>
                        <span className="text-sm text-muted-foreground">
                          ••••••••
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
