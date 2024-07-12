import { User } from "../../../models/UserModel.js"
import { customError } from "../../../utils/error.js";


export const getUserHandler = async (req, res) => {

    const keyword = req.query.search ? {
        $or: [
            { username: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
            { phoneNumber: { $regex: req.query.search, $options: 'i' } }
        ]
    } : {}

    console.log(keyword)
    try {
        const user = await User.find(keyword).find({ _id: { $ne: req.user._id } });
        res.status(200).json({
            status: 200,
            success: true,
            data: {
                user: user
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