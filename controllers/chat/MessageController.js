import { Chat } from "../../models/ChatModel.js";
import { Message } from "../../models/MessageModel.js";
import { User } from "../../models/UserModel.js";
import { customError } from "../../utils/error.js";


//sendMessage handler
export const sendMessageHandler = async (req, res) => {
    const { message, chatId } = req.body;

    if (!message || !chatId) {
        res.status(400).json(
            customError(
                400,
                "message and chatId is required",
                { error: "Missing the required fields 'message' and 'chatId" }
            ));
    }

    let newMessage = new Message({
        sender: req.user._id,
        content: message,
        chat: chatId
    })

    try {
        let newMessageResponse = await newMessage.save();

        await Chat.findByIdAndUpdate(chatId, {
            $set: { latestMessage: newMessageResponse._id },
        },
            { new: true }
        )

        newMessageResponse = await Message.findById(newMessageResponse._id).populate('sender', "username phoneNumber profilePic").populate('chat')
        newMessageResponse = await User.populate(newMessageResponse, {
            path: "chat.users",
            select: "username phoneNumber profilePic"
        })



        res.status(201).json({
            status: 201,
            success: true,
            message: "Message sent successfully",
            data: {
                message: newMessageResponse
            }
        });
    }

    catch (err) {
        res.status(500).json(
            customError(
                500,
                "Internal Server Error",
                { error: err.message }
            ));
    }

}

//getAllMessages handler
export const getAllMessagesHandler = async (req, res) => {
    const chatId = req.query.chatId;

    try {
        let messages = await Message.find({ chat: chatId }).populate('sender', "username phoneNumber profilePic").populate('chat')
        messages = await User.populate(messages, {
            path: "chat.users",
            select: "username phoneNumber profilePic"
        })
        res.status(200).json({
            status: 200,
            success: true,
            message: "Messages fetched successfully",
            data: {
                messages: messages
            }
        })
    }

    catch (err) {
        res.status(500).json(
            customError(
                500,
                "Internal Server Error",
                { error: err.message }
            ));
    }
}