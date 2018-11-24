const router = new (require("restify-router")).Router();
router.get("/", function(req, res, next) {
  res.json({ Message: "Welcome to HR Cebimde API (Node)" });
  next();
});

module.exports = router;
