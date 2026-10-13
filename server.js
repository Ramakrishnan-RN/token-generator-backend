require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const tokenRoutes = require("./routes/tokenRoutes");

const app = express();

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Token Generator API is running"
  });
});

// Token API routes
app.use("/api/tokens", tokenRoutes);

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();