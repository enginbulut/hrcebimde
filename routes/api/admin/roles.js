const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => res.json({ msg: "Roles Works" }));

module.exports = router;
