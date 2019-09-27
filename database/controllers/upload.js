const sizeOf = require('image-size');
import config from '../../config'


class Upload {
	constructor() {
	}

	index(ctx) {
		//从请求中得到文件数据
		var file = ctx.req.file;
		//得到图片尺寸
		var dimensions = sizeOf(file.path);
		
		return (ctx.body ={
			code: 20000,
			data: {
				url:config.uploadPath+file.filename, //本地的图片url地址   config.uploadPath +
				size: dimensions,
				filename:file.originalname
			}
		})

	}
}

export default new Upload()



var multer = require('koa-multer')
var path = require('path')
// 通过 filename 属性定制
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.resolve(__dirname, '../../public/uploads/')); // 保存的路径，备注：需要自己创建
	},
	filename: function (req, file, cb) {
		var extname = path.extname(file.originalname); //获取文件扩展名
		// 将保存文件名设置为 字段名 + 时间戳+文件扩展名，比如 logo-1478521468943.jpg
		cb(null, file.fieldname + '-' + Date.now() + extname);
	}
});


export const uploadMulter= multer({
	storage
})
