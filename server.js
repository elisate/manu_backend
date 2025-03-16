import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
// import Docrouter from "./src/Docs/Swagger.js";
import cors from "cors";
import mainRouter from "./routes/indexRouting.js";

dotenv.config();
const app = express();

// environment variables
const port = process.env.PORT || 3000;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

// Define CORS options
const corsOptions = {
  origin: "*", // Accept requests from any origin
  optionsSuccessStatus: 200,
  credentials: true, // Allow cookies & authentication headers
};


// Use CORS middleware with options
app.use(cors(corsOptions));

// Database connection
const dbUri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.hex2mmr.mongodb.net/${dbName}?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);
mongoose
  .connect(dbUri)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Node API is running on port http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// Routes / Endpoints
app.use(bodyParser.json());
app.use("/", mainRouter);
// app.use("/api-docs", Docrouter);
