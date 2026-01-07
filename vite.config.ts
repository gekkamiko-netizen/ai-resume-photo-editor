
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Vercel上のAPI_KEYをブラウザ実行環境に注入します
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
});
