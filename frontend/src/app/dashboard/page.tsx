"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const accessToken = sessionStorage.getItem("accessToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/user`,
          { headers: { authorization: `Bearer ${accessToken}` } }
        ); // your backend route
        setUser(response.data.data.user);
        setError(null);
      } catch (err) {
        setError("Not authenticated. Please login.");
        router.push("/signup"); // redirect to login if unauthenticated
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return <p>Logged in successfully! Welcome, {JSON.stringify(user) || "User"}.</p>;
}
