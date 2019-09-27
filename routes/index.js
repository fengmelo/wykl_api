import Router from 'koa-router'

import User from '../database/controllers/user'
import Fuser from '../database/controllers/fuser'
import Slider from '../database/controllers/slider'
import Upload from '../database/controllers/upload'
import Config from '../database/controllers/config'
import Product from '../database/controllers/product'

import { verifyToken,verifyTokenFront } from '../auth/user'
import { uploadMulter } from '../database/controllers/upload'

export default () => {
	const router = new Router({
		prefix: '/api'
	})

	// user  后台用户
	router.get('/user/info',verifyToken, User.info)
	router.post('/user/login', User.login)
	router.post('/user/logout', verifyToken, User.logout)

	//前台用户
	router.post('/fuser/login', Fuser.login)
	router.post('/fuser/logout', verifyTokenFront, Fuser.logout)
	// slider
	router.get('/slider/list',verifyToken, Slider.list)
	router.post('/slider/create',verifyToken, Slider.create)
	router.post('/slider/edit',verifyToken, Slider.edit)


	//product
	router.post('/product/create',verifyToken, Product.create)
	router.post('/product/edit',verifyToken, Product.edit)
	router.post('/product/handle',verifyToken, Product.handle)

	router.get('/product/list', Product.list)
	router.get('/product/detail', Product.detail)




	// upload
	router.post('/upload/index',uploadMulter.single('file'), Upload.index)
	// config
	router.get('/config/list', Config.list)

	return router
}