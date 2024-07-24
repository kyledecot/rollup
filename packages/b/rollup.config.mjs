import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { spawn } from "child_process";
import fs from 'fs';

const wasmBindgen = () => {
    return {
        name: "rollup-plugin-wasm-bindgen",
        resolveId: {
            handler(id) {
                if (id === "a_bg.wasm") {
                    return id;
                }

                return null;
            }
        },
        load: {
            handler(id) {
                if (id === "a_bg.wasm") {
                    return fs.readFileSync(`../a/build/a_bg.wasm`).toString('binary');
                }

                return null;
            }
        },
        transform: {
            handler(_, id) {
                if (id === "a_bg.wasm") {
                    return {
                        map: {
                            mappings: '',
                        },
                        code: `
                        import "\0./a_bg.wasm";
                        export default new URL('./a_bg.wasm', import.meta.url);`,
                    }
                } 

                return null;
            }
        },
        generateBundle: {
            handler() {

                const wasm = fs.readFileSync(`../a/build/a_bg.wasm`);

                this.emitFile({
                    type: "asset",
                    fileName: 'a_bg.wasm',
                    source: wasm
                });
            }
        },
        buildStart: {
            sequential: true,
            handler() {
                return new Promise((resolve, reject) => {
                    const bind = spawn('wasm-bindgen', [
                        './target/wasm32-unknown-unknown/release/a.wasm',
                        '--out-dir',
                        "./build",
                        '--omit-default-module-path',
                        '--target',
                        'web',
                        '--out-name',
                        "a",
                    ], { stdio: "inherit", cwd: "../a" });

                    bind.on('exit', (code) => {
                        if (code !== 0) {
                            reject({code});
                        }

                        console.log("Successfully ran wasm-bindgen!")


                        resolve();
                    });
                })
            }
        },
    }
};

const cargo = () => {
    return {
        name: "rollup-plugin-cargo",
        buildStart: {
            sequential: true,
            handler() {
                return new Promise((resolve) => {
                    const build = spawn('cargo', [
                        'build',
                        '--release',
                        '--target',
                        'wasm32-unknown-unknown'
                    ], { stdio: "inherit", cwd: "../a" });

                    build.on('close', () => {
                        resolve();
                    })
                })
            }
        }
    }
}

export default {
    input: ['src/index.tsx', 'src/worker.ts'],
    output: {
        dir: './lib/',
        format: 'esm',
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: 'src',
    },
    external: ['react'],
    plugins: [
        cargo(),
        wasmBindgen(),
		nodeResolve(),
        typescript({ tsconfig: './tsconfig.json' }),
    ]
}
