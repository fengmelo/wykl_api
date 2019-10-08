import mongoose from 'mongoose'

const NodeSchema = new mongoose.Schema({
	title:String,
	code:String,
	pid:String,
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

NodeSchema.pre('save', function (next) {
  if (this.isNew) {
		this.status=1
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})

export default mongoose.model('Node', NodeSchema)