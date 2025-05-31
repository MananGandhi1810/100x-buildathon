"use client";

import type * as React from "react";
import {
  FileText,
  GitPullRequest,
  Shield,
  MessageSquare,
  Rocket,
  Network,
  TestTube,
  Server,
  Home,
  Settings,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { RepositorySelector } from "@/components/repository-selector";
import { UserNav } from "@/components/user-nav";

const devTools = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "README Generator",
    url: "/dashboard/readme-generator",
    icon: FileText,
  },
  {
    title: "Pull Request Analyzer",
    url: "/dashboard/pr-analyzer",
    icon: GitPullRequest,
  },
  {
    title: "Vulnerability Scanner",
    url: "/dashboard/vulnerability-scanner",
    icon: Shield,
  },
  {
    title: "Chat with Code",
    url: "/dashboard/chat-with-code",
    icon: MessageSquare,
  },
  {
    title: "Deploy with Chat",
    url: "/dashboard/deploy-with-chat",
    icon: Rocket,
  },
  {
    title: "Code Structure Visualization",
    url: "/dashboard/code-structure",
    icon: Network,
  },
  {
    title: "Automated Testing",
    url: "/dashboard/automated-testing",
    icon: TestTube,
  },
  {
    title: "Environment Provisioning",
    url: "/dashboard/environment-provisioning",
    icon: Server,
  },
];

const settingsItems = [
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
];

export function DevToolsSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-grain">
        <RepositorySelector />
      </SidebarHeader>
      <SidebarContent className="bg-grain">
        <SidebarGroup>
          <SidebarGroupLabel>Developer Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {devTools.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-grain">
        <UserNav />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
