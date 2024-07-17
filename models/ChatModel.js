import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }
    ],
    chatName: {
        type: String,
        required: true,
        trim: true
    },
    latestMessage: {
        type: mongoose.Types.ObjectId,
        ref: "Message",
        default: null
    },
    groupAdmin: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },

}, {
    timestamps: true
})

export const Chat = mongoose.model('Chat', chatSchema)