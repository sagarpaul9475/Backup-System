require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

require("./scheduler");

const backupRoutes = require("./routes/backupRoutes");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/backups", backupRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
