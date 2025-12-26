const express = require("express");
const cors = require("cors");

const app = express();

// Connect to MongoDB
const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    // Determine the URI: use env var if persistent, otherwise warn (or fail if critical)
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    // Don't exit process in serverless environment, but log error
  }
};
connectDB();

// Removed In-Memory Mock Database


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/resume", require("./routes/resume"));
app.use("/api/portfolio", require("./routes/portfolio-mock"));
app.use("/api/auth", require("./routes/auth"));
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
