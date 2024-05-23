import terser from "@rollup/plugin-terser";

export default {
    input: 'src/index.mjs',
    output: [
        { dir: "build", format: "cjs", entryFileNames: 'index.cjs.js'},
        { dir: "build", format: "cjs", plugins: [terser()], entryFileNames: 'index.cjs.min.js' },
        { dir: "build", format: "esm", entryFileNames: 'index.esm.mjs' },
        { dir: "build", format: "esm", plugins: [terser()], entryFileNames: 'index.esm.min.mjs' }
    ]
};