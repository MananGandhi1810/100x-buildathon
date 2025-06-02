"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Play,
  Square,
  Eye,
  ExternalLink,
  GitBranch,
  Clock,
  Server,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { useParams } from "next/navigation";

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

const frameworks = [
  "Node",
  "React",
  "Express",
  "Next",
  "Flask",
  "Django",
  "Docker",
  "Other",
];

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const params = useParams<{ id: string }>();

  // Form state for new deployment
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    githubUrl: "",
    framework: "",
    envSecrets: [{ key: "", value: "" }],
  });

  const fetchProjectData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/project/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      const projectData = response.data.data.project;
      console.log("Project data response:", projectData);
      setFormData((prev) => ({
        ...prev,
        githubUrl: projectData.repoUrl,
      }));
    } catch (error) {
      console.error("Error fetching project data:", error);
      toast.error("Failed to fetch project data");
    }
  }, [params.id]);

  useEffect(() => {
    const init = async () => {
      await fetchDeployments();
      await fetchProjectData();
    };
    init();
  }, [fetchProjectData]);

  const fetchDeployments = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/deployment`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      setDeployments(response.data.data.deployments);
    } catch (error) {
      console.error("Error fetching deployments:", error);
      toast.error("Failed to fetch deployments");
    } finally {
      setLoading(false);
    }
  };

  const createDeployment = async () => {
    try {
      const filteredEnvSecrets = formData.envSecrets.filter(
        (secret) => secret.key.trim() && secret.value.trim()
      );

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/deployment/new`,
        {
          ...formData,
          envSecrets: filteredEnvSecrets,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );

      toast.success("Deployment created successfully");

      setIsCreateDialogOpen(false);
      setFormData({
        name: "",
        description: "",
        githubUrl: "",
        framework: "",
        envSecrets: [{ key: "", value: "" }],
      });
      fetchDeployments();
    } catch (error: unknown) {
      console.error("Error creating deployment:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create deployment";
      toast.error(errorMessage);
    }
  };

  const startDeployment = async (deploymentId: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/deployment/${deploymentId}/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      toast.success("Deployment started successfully");
      fetchDeployments();
    } catch (error) {
      console.error("Error starting deployment:", error);
      toast.error("Failed to start deployment");
    }
  };

  const stopDeployment = async (deploymentId: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/deployment/${deploymentId}/stop`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      toast.success("Deployment stopped successfully");
      fetchDeployments();
    } catch (error) {
      console.error("Error stopping deployment:", error);
      toast.error("Failed to stop deployment");
    }
  };

  const getDeploymentStatus = async (deploymentId: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/deployment/${deploymentId}/status`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data.data.status;
    } catch (error) {
      return "unknown";
    }
  };

  const addEnvSecret = () => {
    setFormData((prev) => ({
      ...prev,
      envSecrets: [...prev.envSecrets, { key: "", value: "" }],
    }));
  };

  const removeEnvSecret = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      envSecrets: prev.envSecrets.filter((_, i) => i !== index),
    }));
  };

  const updateEnvSecret = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      envSecrets: prev.envSecrets.map((secret, i) =>
        i === index ? { ...secret, [field]: value } : secret
      ),
    }));
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
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading deployments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deployments</h1>
          <p className="text-muted-foreground">
            Manage your application deployments
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Deployment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Deployment</DialogTitle>
              <DialogDescription>
                Deploy your application from a GitHub repository
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="my-awesome-app"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="framework">Framework</Label>
                  <Select
                    value={formData.framework}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, framework: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select framework" />
                    </SelectTrigger>
                    <SelectContent>
                      {frameworks.map((framework) => (
                        <SelectItem key={framework} value={framework}>
                          {framework}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  disabled
                  value={formData.githubUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      githubUrl: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description of your application"
                />
              </div>
              <div className="space-y-2">
                <Label>Environment Variables</Label>
                {formData.envSecrets.map((secret, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="KEY"
                      value={secret.key}
                      onChange={(e) =>
                        updateEnvSecret(index, "key", e.target.value)
                      }
                    />
                    <Input
                      placeholder="VALUE"
                      type="password"
                      value={secret.value}
                      onChange={(e) =>
                        updateEnvSecret(index, "value", e.target.value)
                      }
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeEnvSecret(index)}
                      disabled={formData.envSecrets.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addEnvSecret}>
                  Add Variable
                </Button>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={createDeployment}>Create Deployment</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {deployments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Server className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No deployments yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by creating your first deployment
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Deployment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {deployments.map((deployment) => (
            <Card
              key={deployment.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{deployment.name}</CardTitle>
                  {getStatusBadge(deployment.status)}
                </div>
                <CardDescription>
                  {deployment.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GitBranch className="h-4 w-4" />
                  <span>{deployment.framework}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    Updated{" "}
                    {new Date(deployment.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startDeployment(deployment.id)}
                    disabled={deployment.status === "running"}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => stopDeployment(deployment.id)}
                    disabled={deployment.status !== "running"}
                  >
                    <Square className="h-4 w-4 mr-1" />
                    Stop
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/deployments/${deployment.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </a>
                  </Button>
                </div>
                <Button size="sm" variant="ghost" className="w-full" asChild>
                  <a
                    href={deployment.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View on GitHub
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
