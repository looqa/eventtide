import typescript from '@rollup/plugin-typescript';
import terser from "@rollup/plugin-terser";
import dts from 'rollup-plugin-dts';

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'build/index.cjs.js',
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: 'build/index.esm.js',
                format: 'esm',
                sourcemap: true,
            },
        ],
        plugins: [
            typescript({ tsconfig: './tsconfig.json' }),
            terser({
                format: {
                    comments: false,
                },
            }),
        ],
        external: ['typescript'],
    },
    {
        input: 'src/index.ts',
        output: {
            file: 'build/index.d.ts',
            format: 'es',
        },
        plugins: [dts()],
    },
];