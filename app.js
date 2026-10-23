require("dotenv").config();
const express = require("express");
const sequelize = require("./config/database");
require("./models"); // Register models and associations before sync

const app = express();
app.use(express.json());

app.get("/", (_req, res) => res.json({ message: "Assignment 5 Sequelize API is running" }));
app.use("/users", require("./routes/userRoutes"));
app.use("/posts", require("./routes/postRoutes"));
app.use("/comments", require("./routes/commentRoutes"));

const PORT = process.env.PORT || 3000;
sequelize.sync()
  .then(() => {
    console.log("Database connected and models synchronized");
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch(error => {
    console.error("Unable to connect to database:", error.message);
    process.exit(1);
  });