var fs = require('fs')
var path=require('path')
var mongoose = require('mongoose');
var config=require('../config')
const models = path.resolve(__dirname, '../models')

fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*js$/))
  .forEach(file => require(path.resolve(models, file)))


module.exports =function (app){
	mongoose.set('debug', true)

  mongoose.connect(config.db)

  mongoose.connection.on('disconnected', () => {
    mongoose.connect(config.db)
  })
  mongoose.connection.on('error', err => {
    console.error(err)
  })

  mongoose.connection.on('open', async () => {
		console.log('Connected to MongoDB ', config.db)
	})
}