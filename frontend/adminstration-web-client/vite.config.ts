import { defineConfig } from "vite";
import path from "path";
import glob from "glob";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
