import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Product from "./models/productModel.js";
import Category from "./models/categoryModel.js";
import products from "./data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ✓");

    // Clear existing products and categories
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log("Cleared existing data ✓");

    // Create default category
    const category = await Category.create({
      name: "Electronics",
    });
    console.log("Created default category ✓");

    // Add category ID to all products
    const productsWithCategory = products.map((product) => ({
      ...product,
      category: category._id,
    }));

    // Insert products
    await Product.insertMany(productsWithCategory);
    console.log(`Inserted ${productsWithCategory.length} products ✓`);

    console.log("\n✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDatabase();
