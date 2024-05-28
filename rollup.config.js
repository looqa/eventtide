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
                    mangle: {
                        toplevel: true,
                        reserved: ['busConfig', 'busId', 'path', 'payload', 'eventConfig', 'handler', 'listenConfig']
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
                    mangle: {
                        toplevel: true,
                        reserved: ['busConfig', 'busId', 'path', 'payload', 'eventConfig', 'handler', 'listenConfig']
                    }
                })],
            entryFileNames: 'index.esm.mjs'
        },
    ]
};