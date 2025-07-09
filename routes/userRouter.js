import express from "express";
import { register, login, logout, getOtherUsers } from "../controllers/usercontroller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
 


const router = express.Router();

//Hồi nãy ghi sai lỗi là router.router
// đúng là router.post
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/", isAuthenticated, getOtherUsers)
export default router;