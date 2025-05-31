"use client";

import { Input } from "@/components/ui/input";
import { Search, Plus, Star, GitFork, LogOut, User } from "lucide-react";
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

// Add proper type for the repository data
interface Repository {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  stars: number;
  language: string;
  forks: number;
}

interface User {
  name: string;
  email: string;
  avatarUrl?: string;
}

// Update the repositories array with proper type
const repositories: Repository[] = [
  {
    id: "1",
    name: "code-ai-platform",
    description: "An AI-powered code analysis and development platform",
    stars: 1234,
    language: "TypeScript",
    lastUpdated: "2 days ago",
    forks: 0,
  },
  {
    id: "2",
    name: "ml-model-trainer",
    description: "Machine learning model training and deployment toolkit",
    stars: 890,
    language: "Python",
    lastUpdated: "1 week ago",
    forks: 0,
  },
  {
    id: "3",
    name: "react-components",
    description: "Collection of reusable React components",
    stars: 567,
    language: "JavaScript",
    lastUpdated: "3 days ago",
    forks: 0,
  },
  {
    id: "4",
    name: "api-gateway",
    description: "Microservices API gateway with authentication",
    stars: 789,
    language: "Go",
    lastUpdated: "5 days ago",
    forks: 0,
  },
  {
    id: "5",
    name: "data-visualization",
    description: "Interactive data visualization library",
    stars: 432,
    language: "TypeScript",
    lastUpdated: "1 day ago",
    forks: 0,
  },
  {
    id: "6",
    name: "cloud-deployment",
    description: "Cloud infrastructure deployment automation",
    stars: 654,
    language: "Terraform",
    lastUpdated: "4 days ago",
    forks: 0,
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchUser() {
      try {
        const accessToken = sessionStorage.getItem("accessToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/user`,
          { headers: { authorization: `Bearer ${accessToken}` } }
        );
        setUser(response.data.data.user);
      } catch (error) {
        console.error("Error fetching repositories:", error);
        router.push("/signup");
      }
    }
    fetchUser();
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    router.push("/signup");
  };

  const filteredRepos = repositories.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-xl font-bold text-primary">YetiCodes</h1>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full hover:bg-accent"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
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
          <Button className="gap-2 shadow-sm hover:shadow-md transition-all">
            <Plus className="h-4 w-4" />
            Import Repository
          </Button>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepos.map((repo) => (
            <Card
              key={repo.id}
              className="group hover:border-primary/50 transition-all duration-200 hover:shadow-md"
            >
              <a href={`/dashboard/${repo.id}`} className="block">
                <CardHeader className="pb-3">
                  <CardTitle className="group-hover:text-primary transition-colors text-lg">
                    {repo.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {repo.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                </CardContent>
              </a>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
