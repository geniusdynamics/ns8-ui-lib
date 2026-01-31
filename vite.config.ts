import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib';
  
  const baseConfig = {
    plugins: [
      vue(), 
      tailwindcss(),
      ...(isLib ? [dts({ 
        include: ['index.ts', 'src/**/*.ts', 'src/**/*.vue'],
        tsconfigPath: './tsconfig.app.json',
        insertTypesEntry: true
      })] : [])
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };

  if (isLib) {
    return {
      ...baseConfig,
      build: {
        lib: {
          entry: resolve(__dirname, 'index.ts'),
          name: 'Ns8UiLib',
          fileName: (format) => `ns8-ui-lib.${format}.js`,
          formats: ['es', 'umd']
        },
        rollupOptions: {
          external: ['vue', 'vue-router', 'lucide-vue-next'],
          output: {
            globals: {
              vue: 'Vue',
              'vue-router': 'VueRouter',
              'lucide-vue-next': 'LucideVueNext'
            },
            exports: 'named'
          }
        },
        sourcemap: true,
        emptyOutDir: true
      }
    };
  }

  return baseConfig;
});
