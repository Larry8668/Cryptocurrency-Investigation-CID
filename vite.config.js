import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({

plugins: [react()],

define: {

'process.env.VITE_VERCEL_DEV_MODE':JSON.stringify(process.env.VITE_VERCEL_DEV_MODE),

'process.env.VITE_VERCEL_KV_REST_API_READ_ONLY_TOKEN':JSON.stringify(process.env.VITE_VERCEL_KV_REST_API_READ_ONLY_TOKEN),

'process.env.VITE_VERCEL_KV_REST_API_TOKEN':JSON.stringify(process.env.VITE_VERCEL_KV_REST_API_TOKEN),

'process.env.VITE_VERCEL_KV_REST_API_URL':JSON.stringify(process.env.VITE_VERCEL_KV_REST_API_URL),

'process.env.VITE_VERCEL_KV_URL':JSON.stringify(process.env.VITE_VERCEL_KV_URL),

}

})