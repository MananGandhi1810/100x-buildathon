"use client";

import { Input } from "@/components/ui/input";
import { Search, Plus, LogOut, User, Github } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Update the Project interface to match your API
interface Project {
  id: string;
  title: string;
  description: string;
  repoUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  name: string;
  email: string;
  avatarUrl?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [repoTitle, setRepoTitle] = useState("");
  const [repoDescription, setRepoDescription] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    const init = async () => {
      await fetchUser();
      await fetchProjects();
    };
    init();
  }, [router]);

  const fetchUser = async () => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/user`,
        {
          headers: { authorization: `Bearer ${accessToken}` },
        }
      );
      setUser(data.data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      router.push("/signup");
    }
  };

  const fetchProjects = async () => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/project/list`,
        {
          headers: { authorization: `Bearer ${accessToken}` },
        }
      );
      setProjects(response.data.data.projectData);
      console.log("Fetched projects:", response.data.data.projectData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      });
    }
  };

  const handleImportRepository = async () => {
    if (!repoUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a repository URL",
        variant: "destructive",
      });
      return;
    }

    // Validate GitHub URL format
    const ghRepoRegex = /https?:\/\/(www\.)?github.com\/[\w.-]+\/[\w.-]+/;
    if (!ghRepoRegex.test(repoUrl)) {
      toast({
        title: "Error",
        description: "Please enter a valid GitHub repository URL",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL
        }/project/create?repo=${encodeURIComponent(
          repoUrl
        )}&title=${encodeURIComponent(
          repoTitle
        )}&description=${encodeURIComponent(repoDescription)}`,
        {},
        { headers: { authorization: `Bearer ${accessToken}` } }
      );

      toast({
        title: "Success",
        description: "Repository imported successfully!",
      });

      // Refresh the projects list
      await fetchProjects();

      // Close dialog and reset form
      setIsImportDialogOpen(false);
      setRepoUrl("");
      setRepoTitle("");
      setRepoDescription("");
    } catch (error: unknown) {
      console.error("Error importing repository:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to import repository";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    router.push("/signup");
  };

  const getRepoName = (url: string) => {
    const match = url.match(/github\.com\/[\w.-]+\/([\w.-]+)/);
    return match ? match[1] : "Unknown Repository";
  };

  const getRepoOwner = (url: string) => {
    const match = url.match(/github\.com\/([\w.-]+)\/[\w.-]+/);
    return match ? match[1] : "Unknown Owner";
  };

  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   const now = new Date();
  //   const diffTime = Math.abs(now.getTime() - date.getTime());
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  //   if (diffDays === 1) return "1 day ago";
  //   if (diffDays < 7) return `${diffDays} days ago`;
  //   if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  //   return `${Math.ceil(diffDays / 30)} months ago`;
  // };

  const filteredProjects = projects.filter(
    (project) =>
      getRepoName(project.repoUrl)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-8 p-6 mt-16 container mx-auto py-6 bg-transparent">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm bg-grain">
        <div className="flex h-16 items-center px-4 container mx-auto">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-primary">10000x Devs</h1>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full hover:bg-accent"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                    <AvatarImage
                      src={user?.avatarUrl || "/placeholder.svg"}
                      alt={user?.name}
                    />
                    <AvatarFallback className="bg-primary/10">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/profile")}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-500 focus:text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <div className="space-y-8 p-6 mt-16 container mx-auto py-6 bg-transparent">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Your Repositories
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and analyze your code repositories
            </p>
          </div>

          <Dialog
            open={isImportDialogOpen}
            onOpenChange={setIsImportDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-sm hover:shadow-md transition-all">
                <Plus className="h-4 w-4" />
                Import Repository
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  Import GitHub Repository
                </DialogTitle>
                <DialogDescription>
                  Enter the GitHub repository URL you want to import and
                  analyze.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="repo-url" className="text-sm font-medium">
                    Repository URL <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="repo-url"
                    placeholder="https://github.com/username/repository"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Make sure the repository is public or you have access to it.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="repo-title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="repo-title"
                    placeholder="My Awesome Project"
                    value={repoTitle}
                    onChange={(e) => setRepoTitle(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="repo-description"
                    className="text-sm font-medium"
                  >
                    Description
                  </label>
                  <Input
                    id="repo-description"
                    placeholder="A brief description of your project"
                    value={repoDescription}
                    onChange={(e) => setRepoDescription(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsImportDialogOpen(false);
                    setRepoUrl("");
                    setRepoTitle("");
                    setRepoDescription("");
                  }}
                  disabled={isImporting}
                >
                  Cancel
                </Button>
                <Button onClick={handleImportRepository} disabled={isImporting}>
                  {isImporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Importing...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Import
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search repositories..."
              className="pl-9 h-11 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Github className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No repositories found
            </h3>
            <p className="text-muted-foreground mb-4">
              {projects.length === 0
                ? "Get started by importing your first repository"
                : "No repositories match your search criteria"}
            </p>
            {projects.length === 0 && (
              <Button
                onClick={() => setIsImportDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Import Repository
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="group hover:border-primary/50 transition-all duration-200 hover:shadow-md"
              >
                <a href={`/dashboard/${project.id}`} className="block">
                  <CardHeader className="pb-3">
                    <CardTitle className="group-hover:text-primary transition-colors text-lg">
                      {project.title || getRepoName(project.repoUrl)}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description ||
                        `Repository: ${getRepoOwner(
                          project.repoUrl
                        )}/${getRepoName(project.repoUrl)}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Github className="h-4 w-4" />
                        <span className="truncate max-w-[120px]">
                          {getRepoOwner(project.repoUrl)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </a>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
