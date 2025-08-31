import userModel from "./models/userModel.js";
import dotenv from "dotenv";
import { dbconnect } from "./config/dbconnect.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await dbconnect();

    const adminExist = await userModel.findOne({ email: process.env.ADMIN_EMAIL });
    if (adminExist) {
      console.log("Admin already exists");
      return process.exit(0);
    }

    const adminObj = {
      name: "forever admin",
      password:  process.env.ADMIN_PASSWORD ,
      email: process.env.ADMIN_EMAIL,
      role: "admin"
    };

    await userModel.create(adminObj);
    console.log("Admin created successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error in creating admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
