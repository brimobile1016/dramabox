import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost",
    port: 8080,
    proxy: {
      "/api/dramabox/detail": {
        target: "https://api.sansekai.my.id",
        changeOrigin: true,
        rewrite: (path) => {
          const bookId = path.split("/").pop();
          return `/api/dramabox/detail?bookId=${bookId}`;
        },
      },
      "/api/dramabox/allepisode": {
        target: "https://api.sansekai.my.id",
        changeOrigin: true,
        rewrite: (path) => {
          const bookId = path.split("/").pop();
          return `/api/dramabox/allepisode?bookId=${bookId}`;
        },
      },
      "/api": {
        target: "https://api.sansekai.my.id",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
