import mongoose, { mongo } from "mongoose";

const MONGODB_URI = process.env.DB_URL!;

if (!MONGODB_URI) {
  throw new Error("Please provide the mongo db url");
}

export default async function connectToDatabase() {
  if(mongoose.connection.readyState === 1)
  {
    console.log("Already connected to the Database")
    return
  }

  try {
    mongoose.connect(MONGODB_URI)
    console.log("Database Connected Successfully!")
  } catch (error) {
    console.log("Something went wrong with database connection")
    console.log(error)
  }
}
