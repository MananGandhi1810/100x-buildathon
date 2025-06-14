"use server";

import { Redis } from "@upstash/redis";
import { v4 as uuidv4 } from "uuid";

export async function submitEmail(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Invalid email format",
      };
    }

    // Initialize Redis client from environment variables
    const redis = Redis.fromEnv();

    // Check if email already exists
    const emailExists = await redis.sismember("all_emails", email);
    if (emailExists) {
      return {
        success: false,
        error: "This email is already on the waitlist",
      };
    }

    // Generate a unique ID for this email submission
    const id = uuidv4();
    const timestamp = new Date().toISOString();

    // Store the email with metadata
    await redis.hset(`email:${id}`, {
      id,
      email,
      timestamp,
    });

    // Also maintain a set of all emails for easy lookup
    await redis.sadd("all_emails", email);

    // Increment waitlist counter
    await redis.incr("waitlist_count");

    return { success: true };
  } catch (error) {
    console.error("Failed to store email:", error);
    return {
      success: false,
      error: "Failed to store your email. Please try again later.",
    };
  }
}
