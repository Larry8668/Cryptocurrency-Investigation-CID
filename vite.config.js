import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],

  define: {
    "process.env.VITE_VERCEL_DEV_MODE": JSON.stringify(
      process.env.VITE_VERCEL_DEV_MODE
    ),

    "process.env.VITE_VERCEL_KV_REST_API_READ_ONLY_TOKEN": JSON.stringify(
      process.env.VITE_VERCEL_KV_REST_API_READ_ONLY_TOKEN
    ),
    "import.meta.env.VITE_VERCEL_KV_REST_API_URL": JSON.stringify(
      process.env.VITE_VERCEL_KV_REST_API_URL
    ),
    "import.meta.env.VITE_VERCEL_KV_REST_API_TOKEN": JSON.stringify(
      process.env.VITE_VERCEL_KV_REST_API_TOKEN
    ),
    "process.env.VITE_VERCEL_KV_URL": JSON.stringify(
      process.env.VITE_VERCEL_KV_URL
    ),
    "import.meta.env.VITE_VERCEL_UPSTASH_REDIS_REST_URL": JSON.stringify(
      process.env.VITE_VERCEL_UPSTASH_REDIS_REST_URL
    ),
    "process.env.VITE_VERCEL_UPSTASH_REDIS_REST_TOKEN": JSON.stringify(
      process.env.VITE_VERCEL_UPSTASH_REDIS_REST_TOKEN
    ),
    "process.env.VITE_VERCEL_AUTH0_CLIENT_ID": JSON.stringify(
      process.env.VITE_VERCEL_AUTH0_CLIENT_ID
    ),
    "process.env.VITE_VERCEL_AUTH0_DOMAIN": JSON.stringify(
      process.env.VITE_VERCEL_AUTH0_DOMAIN
    ),
    "process.env.VITE_VERCEL_GEMINI_API_KEY": JSON.stringify(
      process.env.VITE_VERCEL_GEMINI_API_KEY
    ),
  },
});