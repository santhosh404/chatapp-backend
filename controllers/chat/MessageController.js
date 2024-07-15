

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

    var newMessage = {
        sender: req.user._id,
        content: message,
        chatId: chatId
    }

    

}