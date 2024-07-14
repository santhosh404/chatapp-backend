import { User } from "../../../models/UserModel.js";
import { customError } from "../../../utils/error.js";
import { generateToken } from "../../../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const signInHandler = async (req, res) => {
    const { phoneNumber, password } = req.body;

    try {
        if (!phoneNumber || !password) {
            return res
                .status(400)
                .json(customError(
                    400,
                    "Bad Request",
                    { error: "Missing required fields (phoneNumber, password)" }
                ));
        }

        // Check if user already exists
        const userCheck = await User.findOne({ phoneNumber });

        if (!userCheck) {
            return res
                .status(400)
                .json(customError(
                    400,
                    "User not exists",
                    { error:  "User with phone number not found"}
                ));
        }

        const comparePassword = await bcrypt.compare(password, userCheck.password);
        if(!comparePassword) {
            return res.status(401).json(customError(
                401,
                "Unauthorized",
                { error:  "Invalid password"}
            ));
        }
        return res.status(200).json({
            status: 200,
            success: true,
            message: "User signed in successfully",
            data: {
                user: {
                    _id: userCheck._id,
                    username: userCheck.username,
                    email: userCheck.email,
                    phoneNumber: userCheck.phoneNumber,
                    profile: userCheck.profilePic
                },
                token: generateToken(userCheck._id)
            }

        });
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
