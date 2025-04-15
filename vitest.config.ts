import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Use global APIs like describe, it, expect
    environment: 'jsdom', // Simulate browser environment
    setupFiles: './vitest.setup.ts', // Optional setup file
    // Include test files in src directory
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    // You might want to exclude certain directories
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    // Optional: Configure coverage
    // coverage: {
    //   provider: 'v8', // or 'istanbul'
    //   reporter: ['text', 'json', 'html'],
    //   include: ['src/**'],
    //   exclude: [
    //     'src/types/**',
    //     'src/app/**', // Exclude pages/layouts unless testing components within
    //     'src/middleware.ts',
    //     '**/*.config.{js,ts}',
    //     '**/*.setup.{js,ts}',
    //   ],
    // },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Match tsconfig paths alias
    },
  },
}) 