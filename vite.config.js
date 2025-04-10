import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    allowedHosts: [
      '757576b5-b37f-4dc4-a2d8-b47c8d440bf6-00-3m59evhu6ufna.riker.replit.dev' // Replace with your actual Replit host if needed
    ]
  }
});
