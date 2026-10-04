import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  resolve:{
    alias:{
      "@components": path.resolve(import.meta.dirname,"./src/components"),
      "@interfaces": path.resolve(import.meta.dirname,"./src/interfaces"),
      "@services": path.resolve(import.meta.dirname,"./src/services")
    }
  }
})
