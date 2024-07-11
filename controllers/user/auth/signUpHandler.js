import { User } from "../../../models/UserModel.js";
import { customError } from "../../../utils/error.js";
import { generateToken } from "../../../utils/generateToken.js";
import bcrypt from "bcryptjs"

export const signUpHandler = async (req, res) => {
    const { username, email, phoneNumber, password } = req.body;

    try {
        if (!username || !email || !phoneNumber || !password) {
            return res
                .status(400)
                .json(customError(
                    400,
                    "Bad Request",
                    { error: "Missing required fields (username, email, phoneNumber, password)" }
                ));
        }

        // Check if user already exists
        const userCheck = await User.findOne({
            $or: [
                { phoneNumber: phoneNumber },
                { email: email }
            ]
        });

        if (userCheck) {
            const errorMessage = userCheck.phoneNumber === phoneNumber
                ? "User with the same phone number already exists"
                : "User with the same email already exists";

            return res
                .status(400)
                .json(customError(
                    400,
                    "User already exists",
                    { error: errorMessage }
                ));
        }

        const encryptPassword = await bcrypt.hash(password, 10)
        const user = new User({
            username,
            email,
            phoneNumber,
            password: encryptPassword,
        });
        const newUser = await user.save();
        res.status(201).json({
            status: 201,
            success: true,
            message: "User signed up successfully",
            data: {
                user: {
                    _id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    phoneNumber: newUser.phoneNumber,
                    profilePicture: newUser.profilePic
                },
                token: generateToken(newUser._id)
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
