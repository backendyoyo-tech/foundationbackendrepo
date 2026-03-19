const express = require("express");
const cors = require("cors");
require("dotenv").config();

const prisma = require("./config/db");
const contactRoutes = require("./routes/contact.routes");
const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// DB test route
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

//contact api call 
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;

// ✅ DB connection check + start server
async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}

startServer();