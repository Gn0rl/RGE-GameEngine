import { defineConfig } from 'vite';
import path from 'path';
import glsl from 'vite-plugin-glsl'
export default defineConfig({
    plugins: [glsl()],
    resolve: {
    alias: {
        '@': path.resolve(__dirname, './src'),
        '@core': path.resolve(__dirname, './src/core'),
    },
    }
});