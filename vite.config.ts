import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import legacy from "@vitejs/plugin-legacy"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

export default defineConfig({
  base: "",
  build: {
    outDir: "build",
  },
  plugins: [
    TanStackRouterVite(),
    react(),
    legacy({
      targets: ["defaults", "not IE 11", "Android >= 9"],
    }),
  ],
})
