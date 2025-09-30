import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/': 'http://localhost:7000',
      '/uploads/': 'http://localhost:7000',
      '/photos/': 'http://localhost:7000',
      '/files/': 'http://localhost:7000',
    },
  },
});
