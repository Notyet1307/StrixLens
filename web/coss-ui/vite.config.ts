import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  build: {
    outDir: path.resolve(__dirname, "../static/coss"),
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, "src/main.tsx"),
      name: "SILensCossUI",
      formats: ["es"],
      fileName: () => "coss-ui.js",
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.some((n) => n.endsWith(".css")) || assetInfo.name?.endsWith(".css")) {
            return "coss-ui.css";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
});
