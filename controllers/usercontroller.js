import User from "../models/userModel.js";
import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { Op } from "sequelize";
export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    // Trim khoảng trắng ở đầu và cuối chuỗi cho name và email
    const trimmedName = name ? name.trim() : ''; //
    const trimmedEmail = email ? email.trim() : ''; //
    // 2. Kiểm tra nếu sau khi trim mà chuỗi rỗng, hoặc mật khẩu không có
    if (!trimmedName || !trimmedEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    //     console.log("Passwords matched."); // Thêm log
    //       Sequelize sẽ truy vấn CSDL để tìm xem có user nào có email này chưa.

    // Vì truy vấn CSDL là bất đồng bộ (mất thời gian), nên bạn await để chờ kết quả.

    // Sau khi có kết quả (null hoặc object user), thì mới gán cho existingUser.
    const existingUser = await UserModel.findOne({ where: { email: trimmedEmail } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }
    console.log("Email not found, proceeding with registration."); // Thêm log
    // bcrypt.hash() là hàm mã hóa mật khẩu – thao tác nặng và bất đồng bộ.

    // await sẽ chờ nó mã hóa xong, rồi mới gán kết quả vào hashedPassword.
    const hashedPassword = await bcrypt.hash(password, 10);
    const photo = `https://avatar.iran.liara.run/public/boy?name=${name}`;
    // UserModel.create() là hàm Sequelize để thêm user mới vào CSDL.

    // Việc ghi vào DB cũng là một thao tác bất đồng bộ.

    // await sẽ chờ việc ghi dữ liệu hoàn tất, đảm bảo user đã được tạo.

    // Sau khi await xong:
    // Bạn mới an toàn để gửi phản hồi thành công (res.status(201)).
    await UserModel.create({
      name: trimmedName, // Lưu trimmedName vào database
      email: trimmedEmail, // Lưu trimmedEmail vào database
      password: hashedPassword,
      photo,
    });
    console.log("User created successfully in DB."); // Thêm log

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });

  } catch (error) {
    console.error("Register error details:", error); // Log chi tiết lỗi
    return res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // BẮT ĐẦU PHẦN KIỂM TRA TRIM VÀ KHOẢNG TRẮNG
    const trimmedName = name ? name.trim() : '';
    // const trimmedEmail = email ? email.trim() : '';

    // Kiểm tra nếu sau khi trim mà chuỗi rỗng, hoặc mật khẩu không có
    if (!trimmedName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //kiểm tra định dạng email cơ bản
    // Kiểm tra định dạng email
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(trimmedEmail)) { // <-- RẤT QUAN TRỌNG: Đảm bảo là trimmedEmail
    //   return res.status(400).json({ message: "Invalid email format" });
    // }
    // KIỂM TRA CÁI NÀY: NẾU GIÁ TRỊ GỐC KHÁC VỚI GIÁ TRỊ ĐÃ TRIM, TỨC LÀ CÓ KHOẢNG TRẮNG ĐẦU/CUỐI
    // if (name !== trimmedName || email !== trimmedEmail) {
    //   return res.status(400).json({ message: "Name or email cannot start/end with spaces." });
    // }
    // KẾT THÚC PHẦN KIỂM TRA TRIM VÀ KHOẢNG TRẮNG

    // CHẮC CHẮN SỬ DỤNG trimmedName và trimmedEmail Ở ĐÂY
    const user = await User.findOne({ where: { name: trimmedName } });

    if (!user) {
      return res.status(400).json({
        message: "Incorrect  name",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect password",
        success: false
      });
    }

    //tạo token
    const tokenData = {
      userId: user.id// nếu là Sequelize thì dùng `id` chứ không phải `_id`
    }
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
    // Gửi cookie và dữ liệu user
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 ngày
        httpOnly: true,
        // secure: false, // ⚠️ true nếu dùng HTTPS
        sameSite: "lax", // ✅ hoặc "none" nếu secure:true
      })
      .json({
        _id: user.id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        success: true,
        message: "Login successful"
      });



  } catch (error) {
    console.error("Login error details:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "Logged out successfully"
    })
  } catch (error) {
    console.log(error);

  }
}
export const getOtherUsers = async (req, res) => {//lấy danh sạc những người dùng khác trừ mình
  try {
    const loggedUserId = req.id;//req.id đã được gán ở middleware isAuthenticated, là ID người dùng đang đăng nhập.
    const otherUsers = await User.findAll({
      where: {
        id: {
          [Op.ne]: loggedUserId // not equal
        }
      },
      attributes: { exclude: ['password'] } // không lấy password
    });
    return res.status(200).json(otherUsers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
}