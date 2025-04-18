import { register,login,getAllUsers,updateUser, deleteUser, getUserById} from "../controllers/userControllers.js";

import express  from "express"
const userRouter=express();
userRouter.post("/register",register);
userRouter.post("/login",login);
userRouter.get("/getAllUsers",getAllUsers);
userRouter.put("/updateUser",updateUser)
userRouter.delete("/deleteUser/:id",deleteUser)
userRouter.get("/getUserById/:id",getUserById)

export default userRouter;