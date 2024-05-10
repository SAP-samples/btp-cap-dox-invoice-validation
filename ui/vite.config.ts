import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        hmr: {
            port: 5174
        }
    },
    build: {
        outDir: "../router/dist",
        emptyOutDir: true
    },
    resolve: {
        alias: {
            "@": path.resolve("./src"),
            "@pages": path.resolve("./src/pages"),
            "@routes": path.resolve("./src/routes"),
            "@assets": path.resolve("./src/assets"),
            "@entities": path.resolve("./src/types/entities/dox"),
            "@constants": path.resolve("./src/constants")
        }
    }
});
