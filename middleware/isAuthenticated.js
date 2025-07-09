import jwt from "jsonwebtoken";
const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;//lấy token cookie mà bạn đx lưu trong hàm login 
        if (!token) {
            return res.status(401).json({ message: "User not authenticated" })
        }
        const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);//jwt.verify giải mã token trả vè userid
        console.log(decode);

        if (!decode) {
            return res.status(401).json({ message: "Invalid token" });
        };
        req.id = decode.userId; //  bên login  ghi là userId, không phải id
        next();

    } catch (error) {
       console.error("JWT verify failed:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }

}
export default isAuthenticated;
const req = {
    id: "",
}
req.id = "sdlbgnjdfn"