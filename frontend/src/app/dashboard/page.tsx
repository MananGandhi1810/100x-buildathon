"use client";

import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  LogOut,
  User,
  Github,
  LayoutDashboard,
  Rocket,
} from "lucide-react";
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
import Link from "next/link";
import { cn } from "@/lib/utils";
import React, { createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { MagicCard } from "@/components/magicui/magic-card";

// Types
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

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

// Sidebar Context
const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-4 py-4 hidden md:flex md:flex-col bg-transparent w-[60px] shrink-0 items-center mr-4",
          className
        )}
        animate={{
          width: animate ? (open ? "300px" : "100px") : "100px",
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-background w-full border-b border-border"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <IconMenu2
            className="text-foreground"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-background p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-foreground"
                onClick={() => setOpen(!open)}
              >
                <IconX />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  return (
    <a
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2 px-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
        className
      )}
      {...props}
    >
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "none",
          opacity: animate ? (open ? 1 : 0) : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="text-foreground text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </a>
  );
};

// Import Repository Dialog Component
function ImportRepositoryDialog({
  isOpen,
  onOpenChange,
  onImport,
  isImporting,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: { url: string; title: string; description: string }) => void;
  isImporting: boolean;
}) {
  const [repoUrl, setRepoUrl] = useState("");
  const [repoTitle, setRepoTitle] = useState("");
  const [repoDescription, setRepoDescription] = useState("");

  const handleSubmit = () => {
    if (!repoUrl.trim()) {
      toast.error("Please enter a repository URL");
      return;
    }

    // Validate GitHub URL format
    const ghRepoRegex = /https?:\/\/(www\.)?github.com\/[\w.-]+\/[\w.-]+/;
    if (!ghRepoRegex.test(repoUrl)) {
      toast.error("Please enter a valid GitHub repository URL");
      return;
    }

    onImport({ url: repoUrl, title: repoTitle, description: repoDescription });
  };

  const handleClose = () => {
    onOpenChange(false);
    setRepoUrl("");
    setRepoTitle("");
    setRepoDescription("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Import GitHub Repository
          </DialogTitle>
          <DialogDescription>
            Enter the GitHub repository URL you want to import and analyze.
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
            <label htmlFor="repo-description" className="text-sm font-medium">
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
            onClick={handleClose}
            disabled={isImporting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isImporting}>
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
  );
}

// Search Bar Component
function SearchBar({
  searchQuery,
  onSearchChange,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) {
  return (
    <div className="relative flex-1 max-w-2xl">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search repositories..."
        className="pl-9 h-11 shadow-sm border-2 border-border focus-visible:ring-0 focus-visible:ring-offset-0"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}

// Project Card Component
function ProjectCard({ project }: { project: Project }) {
  const getRepoName = (url: string) => {
    const match = url.match(/github\.com\/[\w.-]+\/([\w.-]+)/);
    return match ? match[1] : "Unknown Repository";
  };

  const getRepoOwner = (url: string) => {
    const match = url.match(/github\.com\/([\w.-]+)\/[\w.-]+/);
    return match ? match[1] : "Unknown Owner";
  };

  return (
    <MagicCard className="group hover:border-primary/50 transition-all duration-200 hover:shadow-md rounded-xl">
      <Link href={`/dashboard/${project.id}`} className="block p-6">
        <div className="pb-3">
          <h3 className=" transition-colors text-lg font-semibold">
            {project.title || getRepoName(project.repoUrl)}
          </h3>
          <p className="text-muted-foreground line-clamp-2">
            {project.description ||
              `Repository: ${getRepoOwner(project.repoUrl)}/${getRepoName(
                project.repoUrl
              )}`}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Github className="h-4 w-4" />
            <span className="truncate max-w-[120px]">
              {getRepoOwner(project.repoUrl)}
            </span>
          </div>
        </div>
      </Link>
    </MagicCard>
  );
}

// Loading Skeleton Component
function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-6 container mx-auto py-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
      </div>

      {/* Search and Import Skeleton */}
      <div className="flex items-center gap-4 justify-between w-full">
        <div className="relative flex-1 max-w-2xl">
          <Skeleton className="h-11 w-full" />
        </div>
        <Skeleton className="h-11 w-40" />
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <MagicCard key={index} className="rounded-xl">
            <div className="p-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </MagicCard>
        ))}
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({
  hasProjects,
  onImportClick,
}: {
  hasProjects: boolean;
  onImportClick: () => void;
}) {
  return (
    <div className="text-center py-12">
      <Github className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No repositories found</h3>
      <p className="text-muted-foreground mb-4">
        {!hasProjects
          ? "Get started by importing your first repository"
          : "No repositories match your search criteria"}
      </p>
      {!hasProjects && (
        <MagicCard className="inline-block">
          <Button
            onClick={onImportClick}
            className="gap-2 bg-transparent hover:bg-transparent"
          >
            <Plus className="h-4 w-4" />
            Import Repository
          </Button>
        </MagicCard>
      )}
    </div>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [open, setOpen] = useState(false);

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
      toast.error("Failed to fetch projects");
    }
  };

  const handleImportRepository = async (data: {
    url: string;
    title: string;
    description: string;
  }) => {
    setIsImporting(true);
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      const response = await axios.post(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/project/create?repo=${encodeURIComponent(
          data.url
        )}&title=${encodeURIComponent(
          data.title
        )}&description=${encodeURIComponent(data.description)}`,
        {},
        { headers: { authorization: `Bearer ${accessToken}` } }
      );

      toast.success("Repository imported successfully!");
      await fetchProjects();
      setIsImportDialogOpen(false);
    } catch (error: unknown) {
      console.error("Error importing repository:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to import repository";
      toast.error(errorMessage);
    } finally {
      setIsImporting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    router.push("/signup");
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.repoUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1920px] flex-col overflow-hidden rounded-md bg-muted md:flex-row",
          "h-screen"
        )}
      >
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10 bg-transparent rounded-2xl w-full max-h-[98vh] max-w-[90vw] m-auto">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden items-center">
              {/* Logo */}
              <div className="flex items-center justify-center py-4 border-b border-border mb-4 w-full">
                <motion.div
                  className="flex items-center justify-center"
                  animate={{ opacity: 1 }}
                >
                  <Image
                    src="/adeon.png"
                    alt="Aedon Logo"
                    width={open ? 120 : 32}
                    height={open ? 32 : 32}
                    className="transition-all duration-200"
                  />
                </motion.div>
              </div>

              {/* Navigation Links */}
              <div className="mt-8 flex flex-col gap-2 w-full">
                {[
                  {
                    label: "Dashboard",
                    href: "/dashboard",
                    icon: (
                      <LayoutDashboard className="text-foreground h-5 w-5 flex-shrink-0" />
                    ),
                  },
                  {
                    label: "Deployments",
                    href: "/deployments",
                    icon: (
                      <Rocket className="text-foreground h-5 w-5 flex-shrink-0" />
                    ),
                  },
                ].map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>

            {/* User Profile at Bottom */}
            <div className="border-t border-border pt-4 w-full">
              <div className="flex items-center justify-center gap-2 p-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </div>
          </SidebarBody>
        </Sidebar>

        <div className="flex flex-1 flex-col overflow-hidden bg-card border border-border rounded-2xl h-full max-h-[97vh] max-w-[90vw] m-auto ml-4">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[1920px] flex-col overflow-hidden rounded-md  bg-muted md:flex-row ",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10  rounded-2xl w-full max-h-[98vh] max-w-[90vw] m-auto">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden items-center">
            {/* Logo */}
            <div className="flex items-center justify-center py-4 border-b border-border mb-4 w-full">
              <motion.div
                className="flex items-center justify-center"
                animate={{ opacity: 1 }}
              >
                <Image
                  src="/adeon.png"
                  alt="Aedon Logo"
                  width={open ? 120 : 32}
                  height={open ? 32 : 32}
                  className="transition-all duration-200"
                />
              </motion.div>
            </div>

            {/* Navigation Links */}
            <div className="mt-8 flex flex-col gap-2 w-full">
              {[
                {
                  label: "Dashboard",
                  href: "/dashboard",
                  icon: (
                    <LayoutDashboard className="text-foreground h-5 w-5 flex-shrink-0" />
                  ),
                },
                {
                  label: "Deployments",
                  href: "/deployments",
                  icon: (
                    <Rocket className="text-foreground h-5 w-5 flex-shrink-0" />
                  ),
                },
              ].map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          {/* User Profile at Bottom */}
          <div className="border-t border-border pt-4 w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center justify-center gap-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/10 flex-shrink-0">
                    <AvatarImage
                      src={user?.avatarUrl || "/placeholder.svg"}
                      alt={user?.name}
                    />
                    <AvatarFallback className="bg-primary/10">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <motion.div
                    animate={{
                      display: open ? "block" : "none",
                      opacity: open ? 1 : 0,
                    }}
                    className="text-sm text-foreground"
                  >
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </motion.div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start" forceMount>
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
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex flex-1 flex-col overflow-hidden bg-card border border-border rounded-2xl h-full max-h-[97vh] max-w-[90vw] m-auto ml-4">
        <div className="space-y-8 p-6 container mx-auto py-6 bg-transparent overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 ">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Your Repositories
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and analyze your code repositories
              </p>
            </div>
          </div>

          {/* Search and Import */}
          <div className="flex items-center gap-4 justify-between w-full">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <Dialog
              open={isImportDialogOpen}
              onOpenChange={setIsImportDialogOpen}
            >
              <DialogTrigger asChild>
                <MagicCard className="cursor-pointer rounded-lg p-2">
                  <Button className="gap-2 shadow-sm hover:shadow-md transition-all whitespace-nowrap bg-transparent hover:bg-transparent">
                    <Plus className="h-4 w-4" />
                    Import Repository
                  </Button>
                </MagicCard>
              </DialogTrigger>
            </Dialog>
          </div>

          {/* Content */}
          {filteredProjects.length === 0 ? (
            <EmptyState
              hasProjects={projects.length > 0}
              onImportClick={() => setIsImportDialogOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Import Dialog */}
      <ImportRepositoryDialog
        isOpen={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onImport={handleImportRepository}
        isImporting={isImporting}
      />
    </div>
  );
}
