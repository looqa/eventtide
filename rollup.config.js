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
                    mangle: false,
                    compress: {
                        defaults: false,
                        unused: true,
                        dead_code: true
                    }
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
                    },
                    mangle: false,
                    compress: {
                        defaults: false,
                        unused: true,
                        dead_code: true
                    }
                })],
            entryFileNames: 'index.esm.mjs'
        },
    ]
};