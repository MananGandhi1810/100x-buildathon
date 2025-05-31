"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function TokenPage() {
    const router = useRouter();

    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [requestToken, setRequestToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAccessToken = async (requestToken: string) => {
            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/get-access-token`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${requestToken}`,
                        },
                    }
                );

                const token: string = response.data.data.accessToken;
                setAccessToken(token);

                sessionStorage.setItem("accessToken", token);
                router.push("/dashboard");
            } catch (err: unknown) {
                console.error("Error retrieving access token:", err);
                setError("Failed to retrieve access token");
            } finally {
                setIsLoading(false);
            }
        };

        const params = new URLSearchParams(window.location.search);
        const token = params.get("requestToken");

        if (token) {
            setRequestToken(token);
            console.log("Request token found:", token); // Debug log
            fetchAccessToken(token);
        } else {
            setError("Missing requestToken in URL");
            setIsLoading(false);
        }
    }, [router]);

    if (error) {
        return (
            <div className="p-4">
                <div className="text-red-500 font-medium">Error: {error}</div>
                {requestToken && (
                    <div className="mt-2 text-gray-600">
                        Request token used: {requestToken}
                    </div>
                )}
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="p-4">
                <div className="animate-pulse">Loading access token...</div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Access Token</h1>
            {accessToken ? (
                <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="font-medium mb-2">Token received:</div>
                    <div className="break-all font-mono bg-white p-2 rounded border">
                        {accessToken}
                    </div>
                </div>
            ) : (
                <div className="text-gray-600">
                    No access token received
                    {requestToken && (
                        <div className="mt-2">
                            <div className="font-medium">Request token used:</div>
                            <div className="break-all font-mono bg-white p-2 rounded border mt-1">
                                {requestToken}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
