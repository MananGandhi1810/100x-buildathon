"use client"

import * as React from "react"
import { Check, ChevronsUpDown, GitBranch } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"

const repositories = [
  {
    name: "my-awesome-project",
    owner: "johndoe",
    private: false,
    language: "TypeScript",
  },
  {
    name: "react-dashboard",
    owner: "johndoe",
    private: true,
    language: "JavaScript",
  },
  {
    name: "api-service",
    owner: "company",
    private: true,
    language: "Python",
  },
  {
    name: "mobile-app",
    owner: "johndoe",
    private: false,
    language: "React Native",
  },
]

export function RepositorySelector() {
  const { isMobile } = useSidebar()
  const [selectedRepo, setSelectedRepo] = React.useState(repositories[0])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GitBranch className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{selectedRepo.name}</span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  {selectedRepo.owner}/{selectedRepo.language}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">Select Repository</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {repositories.map((repo) => (
              <DropdownMenuItem
                key={`${repo.owner}/${repo.name}`}
                onClick={() => setSelectedRepo(repo)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <GitBranch className="size-4 shrink-0" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{repo.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {repo.owner} • {repo.language}
                  </span>
                </div>
                {selectedRepo.name === repo.name && <Check className="ml-auto size-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
