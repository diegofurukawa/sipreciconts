// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@config': path.resolve(__dirname, './src/config'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@services': path.resolve(__dirname, './src/services'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@types': path.resolve(__dirname, './src/types'),
        '@layouts': path.resolve(__dirname, './src/layouts'),
        '@contexts': path.resolve(__dirname, './src/contexts'),
        '@assets': path.resolve(__dirname, './src/assets')
      },
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('Erro no proxy:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Enviando requisição:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Resposta recebida:', proxyRes.statusCode, req.url);
            });
          },
        },
      },
      cors: {
        origin: [
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          env.VITE_API_URL || 'http://localhost:8000'
        ],
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
          'Content-Type', 
          'Authorization', 
          'x-session-id',
          'x-company-id',
          'Accept',
          'Origin',
          'X-Requested-With'
        ],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        credentials: true,
        preflightContinue: true,
        optionsSuccessStatus: 204
      }
    },
    // Otimizações de build
    build: {
      target: 'esnext',
      minify: 'terser',
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': [
              '@radix-ui/react-dialog', 
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-label',
              '@radix-ui/react-switch'
            ],
            'utils-vendor': [
              'axios',
              'date-fns',
              'class-variance-authority',
              'clsx',
              'lucide-react'
            ]
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    // Otimizações de desenvolvimento
    optimizeDeps: {
      include: [
        'react', 
        'react-dom', 
        'react-router-dom',
        'axios',
        '@radix-ui/react-dialog',
        '@radix-ui/react-alert-dialog',
        'lucide-react'
      ],
      exclude: ['@auth/core']
    },
    // Configurações para melhor debugging
    css: {
      devSourcemap: true,
    },
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' }
    },
    preview: {
      port: 3000,
      strictPort: true,
    }
  };
});