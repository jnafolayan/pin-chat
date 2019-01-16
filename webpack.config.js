const path = require('path');

module.exports = {
	entry: './src/main.ts',
	output: {
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /^.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js']
	}
};