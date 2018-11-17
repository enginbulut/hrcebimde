const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/api/admin/users");
const roles = require("./routes/api/admin/roles");
const departments = require("./routes/api/admin/departments");
const branches = require("./routes/api/admin/branches");

const app = express();

//DB config
const db = require("./config/keys").mongoUri;

//connect to MongoDB
mongoose
  .connect(db)
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello"));

//Use routes
app.use("/api/admin/users", users);
app.use("/api/admin/roles", roles);
app.use("/api/admin/departments", departments);
app.use("/api/admin/branches", branches);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
