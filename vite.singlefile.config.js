import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Builds the whole game (code, styles, fonts) into ONE index.html that
// works offline by double-clicking it. Run with: npm run build:offline
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist-offline',
    assetsInlineLimit: 100000000,
  },
});
