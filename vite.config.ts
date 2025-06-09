import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import devtoolsJson from 'vite-plugin-devtools-json'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    RubyPlugin(),
    devtoolsJson(),
  ],
})
