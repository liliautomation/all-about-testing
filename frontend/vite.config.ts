import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// When building for GitHub Pages (project site), assets must be served from
// /all-about-testing/ — set GITHUB_PAGES=true to enable the base path.
const base = process.env.GITHUB_PAGES === 'true' ? '/all-about-testing/' : '/'

export default defineConfig({
  plugins: [react()],
  base,
})