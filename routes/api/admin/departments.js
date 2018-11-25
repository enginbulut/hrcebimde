const router = new (require("restify-router")).Router();
const response = require("../../../service/common").helper.response;

router.get("/test", (req, res, next) => {
  res.json(response({ msg: "Departments Works" }));
  next();
});

module.exports = router;
