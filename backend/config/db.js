import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();
const dbconnection = async () => {
  try {
    const connect = mongoose.connect(process.env.MONGOURL);
    console.log("mongodb connection is successful created");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default dbconnection;
