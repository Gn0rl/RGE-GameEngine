import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript"
import alias from "@rollup/plugin-alias"
import resolve from "@rollup/plugin-node-resolve"
import path from "node:path";

export default {
    input: "src/index.ts",
    output: {
        file: "dist/index.js",
        format: "iife",
    },
    plugins: [alias({
        entries: [{find:"@", replacement: path.resolve('./src')}, {find:"@core", replacement: path.resolve('./src/core')}]
    }), 
    resolve(),
    typescript({
        tsconfig: "./tsconfig.json"
    }), 
    terser()],
}