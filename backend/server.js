import dotenv from "dotenv";
dotenv.config();

import { dbconnect } from './config/dbconnect.js';
import connectToCloudinary from "./config/cloudinary.js";
import app from "./app.js"

const port = process.env.PORT || 4000;


app.get("/", (req, res) => {
  res.json({ status: "active", message: "Server is running fine 🚀" });
});

async function startServer() {
  try {
    await dbconnect(); 
    connectToCloudinary();    
    app.listen(port, () => {
      console.log("Server is running on Port:", port);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

startServer();
