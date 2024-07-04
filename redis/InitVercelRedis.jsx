// import { createClient } from '@vercel/kv';

// let kvClient;

// const url = import.meta.env.VITE_VERCEL_KV_REST_API_URL;
// const token = import.meta.env.VITE_VERCEL_KV_REST_API_TOKEN;

// console.log("Vercel KV URL:", url ? "Set" : "Not set");
// console.log("Vercel KV Token:", token ? "Set" : "Not set");

// if (!url || !token) {
//   console.error("Missing Vercel KV configuration. Make sure environment variables are set correctly.");
//   kvClient = {
//     get: async () => {
//       console.error("Vercel KV not initialized. Cannot perform get operation.");
//       return null;
//     },
//     set: async () => {
//       console.error("Vercel KV not initialized. Cannot perform set operation.");
//     }
//   };
// } else {
//   try {
//     kvClient = createClient({
//       url: url,
//       token: token,
//     });
//     console.log("Vercel KV Client initialized successfully");
//   } catch (error) {
//     console.error("Error initializing Vercel KV Client:", error);
//     kvClient = {
//       get: async () => {
//         console.error("Vercel KV initialization failed. Cannot perform get operation.");
//         return null;
//       },
//       set: async () => {
//         console.error("Vercel KV initialization failed. Cannot perform set operation.");
//       }
//     };
//   }
// }

// export { kvClient };