import { register,login,getAllUsers,updateUser} from "../controllers/userControllers.js";

import express  from "express"
const userRouter=express();
userRouter.post("/register",register);
userRouter.post("/login",login);
userRouter.get("/getAllUsers",getAllUsers);
userRouter.put("/updateUser",updateUser)
export default userRouter;