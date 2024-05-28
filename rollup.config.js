import terser from "@rollup/plugin-terser";

export default {
    input: 'src/index.mjs',
    output: [
        {
            dir: "build",
            format: "cjs",
            plugins: [
                terser({
                    format: {
                        comments: "all"
                    },
                })],
            entryFileNames: 'index.cjs.js'
        },
        {
            dir: "build",
            format: "esm",
            plugins: [
                terser({
                    format: {
                        comments: "all"
                    }
                })],
            entryFileNames: 'index.esm.mjs'
        },
    ]
};