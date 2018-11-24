const router = new (require("restify-router")).Router();
const response = require("../../../routes/responsehelper");

router.get("/test", (req, res, next) => {
  res.json(response({ msg: "Branches Works" }));
  next();
});

module.exports = router;
