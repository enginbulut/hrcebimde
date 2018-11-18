const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/admin/users");
const roles = require("./routes/api/admin/roles");
const departments = require("./routes/api/admin/departments");
const branches = require("./routes/api/admin/branches");

const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//DB config
const db = require("./config/keys").mongoUri;

//connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("It is running"));

//passport middleware
app.use(passport.initialize());
//passport config
require("./config/passport")(passport);

//Use routes
app.use("/api/admin/users", users);
app.use("/api/admin/roles", roles);
app.use("/api/admin/departments", departments);
app.use("/api/admin/branches", branches);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
