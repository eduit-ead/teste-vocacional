import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api/proxy': {
            target: 'https://n8n-new-n8n.ca31ey.easypanel.host',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/proxy/, '/webhook'),
          },
        },
      },
      preview: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api/proxy': {
            target: 'https://n8n-new-n8n.ca31ey.easypanel.host',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/proxy/, '/webhook'),
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
