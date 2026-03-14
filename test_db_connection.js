require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function testConnection() {
    console.log("---- Check Environment Variables ----");
    if (!process.env.MONGO_URI) {
        console.error("❌ MONGO_URI is missing from .env file!");
        process.exit(1);
    }
    // Mask password for display
    const maskedUri = process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@');
    console.log(`Using URI: ${maskedUri}`);

    console.log("\n---- Attempting MongoDB Connection ----");
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("✅ SUCCESS: Connected to MongoDB!");
        console.log("Your credentials are correct.");
        await mongoose.connection.close();
    } catch (error) {
        console.error("\n❌ CONNECTION FAILED");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);

        if (error.codeName === 'AtlasError') {
            console.log("\nPossible Causes:");
            console.log("1. IP Address not whitelisted in MongoDB Atlas (Network Access).");
            console.log("2. Invalid Username or Password in MONGO_URI.");
        }
    }
}

testConnection();
