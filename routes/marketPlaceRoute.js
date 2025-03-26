import { getAllMarkets,createMarket,
    updateMarkets,deleteMarket,
    getMarketById } from "../controllers/marketPlaceController.js";
    import express from "express"
import configureMulter from "../utils/multer.js";

const marketRouter=express();
const upload=configureMulter();
marketRouter.post("/createMarket",upload,createMarket);
marketRouter.get("/getAllMarkets",getAllMarkets)
marketRouter.get("/getMarketById/:id",getMarketById)
marketRouter.delete("/deleteMarket/:id",deleteMarket);
marketRouter.put("/updateMarket/:id",updateMarkets);
export default marketRouter;