import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    name: {
        type: String
    },
    url: {
        type: String
    },
    data: {
        type: Object
    }
})

export const Document = mongoose.model('docs', documentSchema)
