import { merge } from "webpack-merge";
import * as common from "./webpack.common.js";
import WebpackObfuscator from 'webpack-obfuscator';

// Medium obfuscation, optimal performance

export default merge(common, {
	mode: "production",
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
	plugins: [
		new WebpackObfuscator ({
			compact: true,
			controlFlowFlattening: true,
			controlFlowFlatteningThreshold: 0.75,
			deadCodeInjection: true,
			deadCodeInjectionThreshold: 0.4,
			debugProtection: false,
			debugProtectionInterval: 0,
			disableConsoleOutput: true,
			identifierNamesGenerator: 'hexadecimal',
			log: false,
			numbersToExpressions: true,
			renameGlobals: false,
			selfDefending: true,
			simplify: true,
			splitStrings: true,
			splitStringsChunkLength: 10,
			stringArray: true,
			stringArrayCallsTransform: true,
			stringArrayCallsTransformThreshold: 0.75,
			stringArrayEncoding: ['base64'],
			stringArrayIndexShift: true,
			stringArrayRotate: true,
			stringArrayShuffle: true,
			stringArrayWrappersCount: 2,
			stringArrayWrappersChainedCalls: true,
			stringArrayWrappersParametersMaxCount: 4,
			stringArrayWrappersType: 'function',
			stringArrayThreshold: 0.75,
			transformObjectKeys: true,
			unicodeEscapeSequence: false
		}),
	],
});