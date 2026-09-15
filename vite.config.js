import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Use "vercel dev" for local development — it runs both
    // the Vite frontend and the /api serverless functions together
  },
  build: {
    outDir: 'dist',
  },
});
