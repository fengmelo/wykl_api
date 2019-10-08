import mongoose from 'mongoose'

const GroupSchema = new mongoose.Schema({
	title:String,
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

GroupSchema.pre('save', function (next) {
  if (this.isNew) {
		this.status=1
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})

export default mongoose.model('Group', GroupSchema)