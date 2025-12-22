import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]',
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/');

          if (normalizedId.includes('node_modules')) {
            if (normalizedId.includes('vue') || normalizedId.includes('@vue')) {
              return 'vendor-vue';
            }
            if (normalizedId.includes('pinia') || normalizedId.includes('vue-i18n')) {
              return 'vendor-core';
            }
            return 'vendor';
          }

          if (
            normalizedId.includes('/src/composables/') ||
            normalizedId.includes('/src/constants/') ||
            normalizedId.includes('/src/utils/') ||
            normalizedId.includes('/src/types/') ||
            normalizedId.includes('/src/workers/') ||
            normalizedId.includes('/src/stores/')
          ) {
            return 'shared';
          }

          if (normalizedId.includes('/src/locales/')) {
            return 'i18n';
          }

          if (normalizedId.includes('/src/config/lessons/')) {
            return 'lessons';
          }

          if (normalizedId.includes('/src/algorithms/')) {
            return 'algorithms';
          }

          if (normalizedId.includes('/src/components/learn/')) {
            return 'components-learn';
          }

          if (normalizedId.includes('/src/components/workshop/')) {
            return 'components-workshop';
          }

          return 'app';
        }
      },
    },
  },
});
