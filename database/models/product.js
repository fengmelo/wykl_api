import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
	title:String,
	recommend:String,
	desc:String,
	newPrice:Number,
	vipPrice:Number,
	discount:Number,
	beginTime:Number,
	endTime:Number,
	price:Number,
	isKl:Boolean,//非自营
	tags:Array,
	models:Array,
	attrs:Array,
	showPlanes:Array,
	carousel:Array,
	content:String,
	user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true },
	weight: Number,
	status: Number,//1 正常   2 删除
	meta: {
		createdAt: {
			type: Date,
			default: Date.now()
		},
		updatedAt: {
			type: Date,
			default: Date.now()
		}
	}

})

ProductSchema.pre('save', function (next) {
  if (this.isNew) {
		this.status=1
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})

export default mongoose.model('Product', ProductSchema)