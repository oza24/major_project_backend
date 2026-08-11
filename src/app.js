const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes = require("./routes/auth.routes");
const testRoutes = require("./routes/test.routes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ 
        message: "Welcome to the GramHealth API!",
        status: "success",
        version: "1.0.0"
    });
});

app.get("/api/health", (req, res) => {
  res.json({ 
        message: "API is healthy!",
        status: "healthy",
        version: "1.0.0"
    });
});


app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

module.exports = app;