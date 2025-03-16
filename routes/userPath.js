import { register,login} from "../controllers/userControllers.js";

import express  from "express"
const userRouter=express();
userRouter.post("/register",register);
userRouter.post("/login",login);
export default userRouter;