require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();

// Connect to MongoDB Atlas
const mongoose = require("mongoose");
// MongoDB Connection Pattern for Vercel/Serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log('✅ Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable Mongoose buffering to fail fast if no connection
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log('⏳ Connecting to MongoDB...');
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      console.log('✅ New MongoDB connection established');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB Connection Error:', e);
    throw e;
  }

  return cached.conn;
}

// Execute connection on module load, but handle promise rejection globally if needed
connectDB().catch(console.error);
// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://one-build-front.vercel.app',
    'https://one-build-front-git-main-sanikas-projects-fbbeca0.vercel.app',
    'https://one-build-front-*.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/resume", require("./routes/resume"));
app.use("/api/portfolio", require("./routes/portfolio-mock"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/chat", require("./routes/chat")); // AI Chatbot route
app.use("/p", require("./routes/portfolio-mock"));

app.get("/", (req, res) => {
  res.json({ message: "Portfolio Builder API" });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  // Start server only after DB connection
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

module.exports = app;
