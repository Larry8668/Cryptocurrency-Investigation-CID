import { createClient } from '@vercel/kv';

const kvClient = createClient({
  url: import.meta.env.VITE_VERCEL_KV_REST_API_URL,
  token: import.meta.env.VITE_VERCEL_KV_REST_API_TOKEN,
});

console.log("Using Vercel KV Client...")

export { kvClient };