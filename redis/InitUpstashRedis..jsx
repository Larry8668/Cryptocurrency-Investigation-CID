"use server";
import { Redis } from '@upstash/redis';

const url = import.meta.env.VITE_VERCEL_UPSTASH_REDIS_REST_URL;
const token = import.meta.env.VITE_VERCEL_UPSTASH_REDIS_REST_TOKEN;

let upstashClient;

console.log("Upstash Redis URL:", url ? "Set" : "Not set");
console.log("Upstash Redis Token:", token ? "Set" : "Not set");

if (!url || !token) {
  console.error("Missing Upstash Redis configuration. Make sure environment variables are set correctly.");
  upstashClient = {
    get: async () => {
      console.error("Upstash Redis not initialized. Cannot perform get operation.");
      return null;
    },
    set: async () => {
      console.error("Upstash Redis not initialized. Cannot perform set operation.");
    }
  };
} else {
  try {
    upstashClient = new Redis({
      url: url,
      token: token,
    });
    console.log("Upstash Client initialized successfully");
  } catch (error) {
    console.error("Error initializing Upstash Client:", error);
    // Provide fallback methods if initialization fails
    upstashClient = {
      get: async () => {
        console.error("Upstash Redis initialization failed. Cannot perform get operation.");
        return null;
      },
      set: async () => {
        console.error("Upstash Redis initialization failed. Cannot perform set operation.");
      }
    };
  }
}

export { upstashClient };
