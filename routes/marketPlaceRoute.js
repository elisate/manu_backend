import { getAllMarkets,createMarket,
    updateMarkets,deleteMarket,
    getMarketById } from "../controllers/marketPlaceController.js";
    import express from "express"
import configureMulter from "../utils/multer.js";
import mainRouter from "./indexRouting.js";
const marketRouter=express();
const upload=configureMulter();
marketRouter.post("/createMarket",upload,createMarket);
marketRouter.get("/getAllMarkets",getAllMarkets)
export default marketRouter;