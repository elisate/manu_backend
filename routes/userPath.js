import { register,login,getAllUsers} from "../controllers/userControllers.js";

import express  from "express"
const userRouter=express();
userRouter.post("/register",register);
userRouter.post("/login",login);
userRouter.get("/getAllUsers",getAllUsers)
export default userRouter;