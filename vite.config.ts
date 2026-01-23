
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY),
      POSTGRES_URL: JSON.stringify(process.env.POSTGRES_URL),
    },
  },
});
