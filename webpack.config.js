const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require('path');

module.exports = {
	...defaultConfig,
	entry: {
		'block-showfitfile': './src/block-showfitfile.js'
	},
	output: {
		path: path.join(__dirname, './assets/js'),
		filename: '[name].js'
	}
}