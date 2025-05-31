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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { MessageSquare, Send, Bot, User } from "lucide-react";

const chatMessages = [
  {
    role: "assistant",
    content:
      "Hello! I'm your AI code assistant. I can help you understand your codebase, explain functions, suggest improvements, and answer questions about your project. What would you like to know?",
  },
  {
    role: "user",
    content:
      "Can you explain what the authentication middleware does in this project?",
  },
  {
    role: "assistant",
    content:
      "Based on your codebase, the authentication middleware validates JWT tokens and ensures users are authenticated before accessing protected routes. It checks for the Authorization header, verifies the token signature, and attaches user information to the request object.",
  },
];

export default function ChatWithCodePage() {
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
                  <BreadcrumbPage>Chat with Code</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 bg-grain">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Chat with Code
                </h1>
                <p className="text-muted-foreground mt-1.5">
                  Interactive AI assistant for your codebase
                </p>
              </div>
            </div>

            <Card className="flex flex-col h-[calc(100vh-220px)] shadow-sm">
              <CardHeader className="border-b pb-4">
                <CardTitle>Code Assistant</CardTitle>
                <CardDescription>
                  Ask questions about your code, get explanations, and receive
                  suggestions
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 p-4">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-6">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex gap-3 max-w-[80%] ${
                            message.role === "user"
                              ? "flex-row-reverse"
                              : "flex-row"
                          }`}
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {message.role === "user" ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                          </div>
                          <div
                            className={`rounded-lg px-4 py-2.5 text-sm ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="mt-4 flex gap-2 pt-4 border-t">
                  <Input
                    placeholder="Ask a question about your code..."
                    className="flex-1 h-11 shadow-sm"
                  />
                  <Button size="icon" className="h-11 w-11 shadow-sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
