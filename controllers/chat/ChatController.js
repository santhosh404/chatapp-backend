import { Chat } from "../../models/ChatModel.js";
import { User } from "../../models/UserModel.js";
import { customError } from "../../utils/error.js";


//Create chats controller
export const createChatHandler = async (req, res) => {
    const { userId } = req.body;

    try {
        if (!userId) {
            res.status(400).json(
                customError(
                    400,
                    "userId is required",
                    { error: "Missing the required fields 'userId'" }
                ));
        }

        var isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } }
            ]
        })
            .populate("users", "-password")
            .populate("latestMessage");

        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "-password"
        })

        if (isChat.length === 0) {
            const newChat = new Chat({
                users: [req.user._id, userId],
                chatName: "One to One Chat",
                isGroupChat: false
            })
            await newChat.save();

            //find the created chat
            const fullChat = await Chat.findById(newChat._id)
                .populate("users", "-password")
                .populate("latestMessage");

            res.status(201).json({
                status: 201,
                success: true,
                message: "Chat created successfully",
                data: {
                    chat: fullChat
                }
            })
        } else {
            res.status(201).json({
                status: 201,
                success: true,
                message: "Chat already created with the users",
                data: {
                    chat: isChat[0]
                }
            })
        }
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

//Fetch user chats controller
export const fetchUserChats = async (req, res) => {

    try {
        const userChats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } }})
            .populate("users", "-password -createdAt -updatedAt")
            .populate("latestMessage");

        return res.status(200).json({
            status: 200,
            success: true,
            message: "User chats fetched successfully",
            data: {
                userChats: userChats
            }
        })
    }
    catch (err) {
        return res.status(500).json(
            customError(
                500,
                "Internal Server Error",
                { error: err.message }
            ));
    }
}