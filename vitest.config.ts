import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },
  resolve: {
    alias: {
      '@docusaurus/Link': path.resolve(__dirname, 'src/__mocks__/@docusaurus/Link.tsx'),
      '@docusaurus/useDocusaurusContext': path.resolve(__dirname, 'src/__mocks__/@docusaurus/useDocusaurusContext.ts'),
      '@theme/Layout': path.resolve(__dirname, 'src/__mocks__/@theme/Layout.tsx'),
      '@theme/Heading': path.resolve(__dirname, 'src/__mocks__/@theme/Heading.tsx'),
    },
  },
});
