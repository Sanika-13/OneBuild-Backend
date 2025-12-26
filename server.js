const express = require("express");
const cors = require("cors");

const app = express();

// In-Memory Database (Mock)
global.mockDB = {
  users: [],
  portfolios: []
};

console.log("✅ Using In-Memory Mock Database");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/resume", require("./routes/resume"));
app.use("/api/portfolio", require("./routes/portfolio-mock"));
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
