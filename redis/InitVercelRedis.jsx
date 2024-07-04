import { createClient } from '@vercel/kv';


    const kvClient = createClient({
      url: import.meta.env.VITE_VERCEL_KV_REST_API_URL,
      token: import.meta.env.VITE_VERCEL_KV_REST_API_TOKEN,
    });
    console.log("Vercel KV Client initialized successfully");
    

export { kvClient };