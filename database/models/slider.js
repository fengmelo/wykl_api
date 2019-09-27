import mongoose from 'mongoose'

const SliderSchema = new mongoose.Schema({
	url: String,
	name:String,
	product:{ type: mongoose.Schema.Types.ObjectId, ref: 'Product',required:false },
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

SliderSchema.pre('save', function (next) {
  if (this.isNew) {
		this.status=1
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})

export default mongoose.model('Slider', SliderSchema)