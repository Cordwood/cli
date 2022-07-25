export const rollupConfig = (options: InitOpts, name: string) => `import { defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";

export default defineConfig({
    input: "src/index.${options.typescript ? "ts" : "js"}",
    plugins: [
        esbuild({
            minify: true,
            target: ["es2021"]
        }),
        nodeResolve(),
        commonjs(),
    ],
    output: [
        {
            name: "${name}",
            file: "dist/index.js",
            format: "iife",
            compact: true,
            exports: "named",
        }
    ],
});`;

export const packageJson = (options: InitOpts) => ({
    type: "module",
    scripts: { build: `rollup -c --configPlugin esbuild && copyfiles ./manifest.json ./dist/` },
    devDependencies: {
        "@rollup/plugin-commonjs": "*",
        "@rollup/plugin-node-resolve": "*",
        copyfiles: "*",
        esbuild: "*",
        rollup: "*",
        "rollup-plugin-esbuild": "*",
        ...(options.typescript ? { typescript: "*" } : {}),
    },
});


export const gitIgnore = `node_modules/
dist/`

// TODO: When typings are ready, scaffold them in
export const pluginScaffold = (options: InitOpts) => `export default {
    onLoad: () => {
        // Anything that should happen when your plugin is loaded goes here!
        console.log("Hello, world! I'm officially loaded!");
    },
    onUnload: () => {
        // Anything that should happen when your plugin is unloaded goes here.
        console.log("Goodbye, world! I'm officially unloaded!");
    },
}`