import { nodeResolve } from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";

export default [{
	input: "./src/parser.js",
	output: [
		{ format: "cjs", file: "./dist/index.cjs" },
		{ format: "es", file: "./dist/index.js" }
	],
	external(id) {
		return !/^([\.\/]|\w:\\)/.test(id)
	},
	plugins: [
		nodeResolve(),
		copy({
			targets: [{ src: 'src/typing.d.ts', dest: 'dist' }]
		})
	]
}]