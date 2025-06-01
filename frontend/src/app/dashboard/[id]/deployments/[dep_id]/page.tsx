"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Play, Square, RefreshCw, ExternalLink, Server, GitBranch, Clock, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {toast} from "sonner";
import axios from "axios"

interface EnvSecret {
    key: string
    value: string
}

interface Deployment {
    id: string
    name: string
    description?: string
    framework: string
    githubUrl: string
    status?: string
    createdAt: string
    updatedAt: string
    envSecrets?: EnvSecret[]
    containerId?: string
    containerPort?: number
}

export default function DeploymentDetailPage() {
    const [deployment, setDeployment] = useState<Deployment | null>(null)
    const [loading, setLoading] = useState(true)
    const [statusLoading, setStatusLoading] = useState(false)
    const params = useParams()
    const router = useRouter()


    useEffect(() => {
        fetchDeployment()
    }, [params.id])

    const fetchDeployment = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/deployment/${params.dep_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            setDeployment(response.data.data.deployment)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch deployment details",
                variant: "destructive",
            })
            router.push("/deployments")
        } finally {
            setLoading(false)
        }
    }

    const refreshStatus = async () => {
        if (!deployment) return

        setStatusLoading(true)
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/deployment/${deployment.id}/status`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            setDeployment((prev) => (prev ? { ...prev, status: response.data.data.status } : null))
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to refresh status",
                variant: "destructive",
            })
        } finally {
            setStatusLoading(false)
        }
    }

    const startDeployment = async () => {
        if (!deployment) return

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/deployment/${deployment.id}/start`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                },
            )
            toast({
                title: "Success",
                description: "Deployment started successfully",
            })
            refreshStatus()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to start deployment",
                variant: "destructive",
            })
        }
    }

    const stopDeployment = async () => {
        if (!deployment) return

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/deployment/${deployment.id}/stop`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                },
            )
            toast({
                title: "Success",
                description: "Deployment stopped successfully",
            })
            refreshStatus()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to stop deployment",
                variant: "destructive",
            })
        }
    }

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case "running":
                return <Badge className="bg-green-100 text-green-800">Running</Badge>
            case "stopped":
                return <Badge variant="secondary">Stopped</Badge>
            case "exited":
                return <Badge variant="destructive">Exited</Badge>
            default:
                return <Badge variant="outline">Unknown</Badge>
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Loading deployment details...</p>
                </div>
            </div>
        )
    }

    if (!deployment) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Deployment not found</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">{deployment.name}</h1>
                        {getStatusBadge(deployment.status)}
                    </div>
                    <p className="text-muted-foreground">{deployment.description || "No description"}</p>
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
                                <Button size="sm" variant="ghost" onClick={refreshStatus} disabled={statusLoading}>
                                    <RefreshCw className={`h-4 w-4 ${statusLoading ? "animate-spin" : ""}`} />
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
                                <span className="text-sm">{new Date(deployment.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Last Updated</span>
                            <span className="text-sm">{new Date(deployment.updatedAt).toLocaleDateString()}</span>
                        </div>
                        {deployment.containerPort && (
                            <>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Container Port</span>
                                    <span className="text-sm">{deployment.containerPort}</span>
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
                            <Button onClick={startDeployment} disabled={deployment.status === "running"} className="flex-1">
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
                            <a href={deployment.githubUrl} target="_blank" rel="noopener noreferrer">
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
                        <CardDescription>Environment variables configured for this deployment</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {deployment.envSecrets.map((secret, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <span className="font-mono text-sm">{secret.key}</span>
                                    <span className="text-sm text-muted-foreground">••••••••</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
