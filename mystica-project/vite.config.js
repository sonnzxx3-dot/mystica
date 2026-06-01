import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // base: './' нужно, чтобы пути работали внутри Capacitor (file://)
  base: "./",
  build: {
    outDir: "dist",
  },
});
