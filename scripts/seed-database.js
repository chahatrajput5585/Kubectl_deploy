const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../.env"),
  override: true,
});

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const Menu = require("../model/menu");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample menu items from your existing data
const menuItems = [
  {
    name: "Paneer Butter Masala",
    type: "veg",
    price: 180,
    originalPrice: 220,
    image: "images/paneer.png",
    desc: "Creamy cottage cheese in spiced tomato gravy with aromatic herbs",
    rating: 4.5,
    popular: true,
  },
  {
    name: "Veg Biryani",
    type: "veg",
    price: 150,
    image: "images/biryani.png",
    desc: "Fragrant basmati rice cooked with fresh vegetables and exotic spices",
    rating: 4.2,
    popular: false,
  },
  {
    name: "Chicken Biryani",
    type: "nonveg",
    price: 240,
    originalPrice: 280,
    image: "images/chicken.png",
    desc: "Tender chicken layered with aromatic basmati rice and saffron",
    rating: 4.8,
    popular: true,
  },
  {
    name: "Butter Chicken",
    type: "nonveg",
    price: 240,
    image: "images/butter.png",
    desc: "Succulent tandoori chicken in rich, creamy tomato butter sauce",
    rating: 4.7,
    popular: true,
  },
  {
    name: "Aloo Gobi",
    type: "veg",
    price: 130,
    image: "images/aloo.png",
    desc: "Fresh potatoes and cauliflower cooked with traditional Indian spices",
    rating: 4.0,
    popular: false,
  },
  {
    name: "Mix Vegetable Curry",
    type: "veg",
    price: 130,
    image: "images/mix.png",
    desc: "Seasonal vegetables cooked in aromatic curry with fresh herbs",
    rating: 4.1,
    popular: false,
  },
  {
    name: "Punjabi Chole",
    type: "veg",
    price: 130,
    image: "images/chole.png",
    desc: "Spicy chickpeas curry cooked in traditional Punjabi style",
    rating: 4.3,
    popular: false,
  },
  {
    name: "Fish Fry",
    type: "nonveg",
    price: 200,
    originalPrice: 250,
    image: "images/fish.png",
    desc: "Crispy golden fried fish with special masala coating",
    rating: 4.4,
    popular: false,
  },
  {
    name: "Masala Egg Burji",
    type: "nonveg",
    price: 200,
    image: "images/egg.png",
    desc: "Scrambled eggs cooked with onions, tomatoes and aromatic spices",
    rating: 4.0,
    popular: false,
  },
  {
    name: "Egg Biryani",
    type: "nonveg",
    price: 200,
    image: "images/e-biryani.png",
    desc: "Fragrant rice layered with spiced boiled eggs and fresh herbs",
    rating: 4.2,
    popular: false,
  },
  {
    name: "Chicken Fry",
    type: "nonveg",
    price: 200,
    image: "images/chickenn.png",
    desc: "Crispy fried chicken pieces marinated with special spices",
    rating: 4.5,
    popular: false,
  },
  {
    name: "Masala Tea",
    type: "beverages",
    price: 25,
    image: "images/menu-5.png",
    desc: "Traditional Indian tea brewed with aromatic spices and herbs",
    rating: 4.3,
    popular: true,
  },
  {
    name: "Fresh Coffee",
    type: "beverages",
    price: 40,
    image: "images/menu-4.png",
    desc: "Rich, freshly brewed coffee made from premium coffee beans",
    rating: 4.6,
    popular: true,
  },
  {
    name: "Mango Lassi",
    type: "beverages",
    price: 80,
    image: "images/menu-6.png",
    desc: "Refreshing yogurt drink blended with fresh mango pulp",
    rating: 4.4,
    popular: false,
  },
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Create admin user
    console.log("Creating admin user...");
    
    // Check if admin user already exists
    let adminUser = await User.findOne({ email: "admin@restaurant.com" });
    
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      adminUser = new User({
        name: "Admin User",
        email: "admin@restaurant.com",
        password: hashedPassword,
        isAdmin: true,
      });
      
      await adminUser.save();
      console.log("✅ Admin user created successfully!");
      console.log("📧 Email: admin@restaurant.com");
      console.log("🔑 Password: admin123");
    } else {
      console.log("ℹ️ Admin user already exists");
    }

    // Clear existing menu items
    await Menu.deleteMany({});
    console.log("🗑️ Cleared existing menu items");

    // Add menu items
    console.log("Adding menu items...");
    const menuItemsWithAdmin = menuItems.map(item => ({
      ...item,
      addedBy: adminUser._id,
    }));

    await Menu.insertMany(menuItemsWithAdmin);
    console.log(`✅ Added ${menuItems.length} menu items successfully!`);

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n🚀 You can now:");
    console.log("1. Login as admin with: admin@restaurant.com / admin123");
    console.log("2. Access admin dashboard at: /admin");
    console.log("3. Manage menu items and view orders");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

// Handle MongoDB connection
mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connected");
  seedDatabase();
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});
