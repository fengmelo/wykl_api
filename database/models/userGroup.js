import mongoose from 'mongoose'

const UserGroupSchema = new mongoose.Schema({
	user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true },
	group:{ type: mongoose.Schema.Types.ObjectId, ref: 'Group',required:true },
})


export default mongoose.model('UserGroup', UserGroupSchema)