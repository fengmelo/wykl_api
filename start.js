require('babel-register') ({
	presets: [ 'env' ],
	plugins: ["transform-runtime"],
})

module.exports = require('./bin/www')