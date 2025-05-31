"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Add interface for the response data
interface TokenResponse {
  accessToken: string;
  token_type: string;
  scope: string;
}

// Add error type
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export default function TokenPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
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

        const data: TokenResponse = response.data.data;

        if (data.accessToken) {
          const token = data.accessToken;
          sessionStorage.setItem("accessToken", token);
          router.push("/dashboard");
        } else {
          throw new Error("No access token in response");
        }
      } catch (err: unknown) {
        const error = err as ApiError;
        console.error("Error retrieving access token:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to retrieve access token"
        );
        // Redirect back to signup after 3 seconds
        setTimeout(() => {
          router.push("/signup");
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    const params = new URLSearchParams(window.location.search);
    const token = params.get("requestToken");

    if (token) {
      fetchAccessToken(token);
    } else {
      setError("Missing requestToken in URL");
      setIsLoading(false);
      // Redirect back to signup after 3 seconds
      setTimeout(() => {
        router.push("/signup");
      }, 3000);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <p className="text-muted-foreground">Redirecting back to signup...</p>
        </div>
      </div>
    );
  }

  return null;
}
