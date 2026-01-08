require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();

// Connect to MongoDB Atlas
const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
  }
};
connectDB();
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
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
