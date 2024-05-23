import terser from "@rollup/plugin-terser";

export default {
    input: 'src/index.mjs',
    output: [
        { dir: "build", format: "cjs", entryFileNames: 'index.cjs.js'},
        { dir: "build", format: "esm", entryFileNames: 'index.esm.mjs'},
    ]
};