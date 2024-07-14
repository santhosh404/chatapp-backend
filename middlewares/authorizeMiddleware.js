import jwt from "jsonwebtoken";
import { customError } from "../utils/error.js";
import { JWT_SECRET } from "../utils/config.js";

const authorize = async (req, res, next) => {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];
    if (!token) {
        return res
            .status(401)
            .json(customError(
                401,
                "UnAuthorized",
                { error: "Token not provided!" }
            ));
    }
    jwt.verify(token, JWT_SECRET, (err, decode) => {
        if (err) {
            return res
                .status(401)
                .json(customError(
                    401,
                    "UnAuthorized",
                    { error: "Token is not valid!" }
                ));
        }
        req.user = decode;
        next();
    })
}

export { authorize }