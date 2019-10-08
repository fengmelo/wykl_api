import mongoose from 'mongoose'

const GroupNodeSchema = new mongoose.Schema({
	group:{ type: mongoose.Schema.Types.ObjectId, ref: 'Group',required:true },
	node:{ type: mongoose.Schema.Types.ObjectId, ref: 'Node',required:true },
})


export default mongoose.model('GroupNode', GroupNodeSchema)