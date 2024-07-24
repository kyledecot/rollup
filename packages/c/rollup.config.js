import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
	input: './src/index.tsx',
	output: {
		dir: './lib/',
		sourcemap: true,
		preserveModules: true,
		preserveModulesRoot: 'src',
},
	external: ["react"],
	plugins: [
		nodeResolve(),
		typescript({ tsconfig: './tsconfig.json' }),
	],
};
