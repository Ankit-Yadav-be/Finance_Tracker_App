import mongoose from "mongoose";
import Category from "./models/Categorys.js";
import dotenv from "dotenv";

dotenv.config();

const seedCategories = async () => {
  const categories = [
    { name: "Food", description: "Expenses on food and dining" },
    { name: "Transportation", description: "Expenses on transport and fuel" },
    { name: "Shopping", description: "Expenses on shopping and retail" },
    { name: "Utilities", description: "Monthly utility bills" },
    {
      name: "Entertainment",
      description: "Expenses on movies, games, and leisure",
    },
  ];

  try {
    await mongoose.connect(process.env.MONGOURL);
    console.log("Database connected");

    await Category.deleteMany();
    console.log("Old categories removed");

    await Category.insertMany(categories);
    console.log("Categories seeded successfully");

    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding categories:", error);
    mongoose.disconnect();
  }
};

seedCategories();
