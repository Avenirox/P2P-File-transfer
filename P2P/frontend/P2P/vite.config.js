import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import auth from 'vite-plugin-http-basic-auth'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    auth(
      [
        {username: 'admin', password: 'SWSW123123123'}// login to website
      ]
    )
  ],
  server: {
    host: true,
    allowedHosts: true
  }
})
