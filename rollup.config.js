import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript"
import alias from "@rollup/plugin-alias"
import resolve from "@rollup/plugin-node-resolve"
import path from "node:path";
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from "rollup-plugin-polyfill-node"
import glslify from 'rollup-plugin-glslify';

const production = !process.env.ROLLUP_WATCH;

export default {
    input: "src/index.ts",
    preserveModules: false,
    output: {
        // file: "dist/index.js",
        dir: "dist",
        format: "iife",
    },
    plugins: [alias({
        entries: [{find:"@", replacement: path.resolve('./src')}, {find:"@core", replacement: path.resolve('./src/core')}]
    }), 
    glslify(),
    typescript({
        tsconfig: "./tsconfig.json"
    }), 
    commonjs(),
    resolve({preferBuiltins: false}),
    production && terser(),
    nodePolyfills(),],
}