import mongoose from "mongoose"

const documentSchema = new mongoose.Schema({
    user: mongoose.Types.ObjectId,
    name: String,
    images: [String]
})


export default mongoose.model('user_doc',documentSchema)