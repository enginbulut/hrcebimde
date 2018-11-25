const router = new (require("restify-router")).Router();
const passport = require("passport");
const common = require("../../../service/common");

//Load Services
const userService = require("../../../service/user");

common.api.post(router, "/register", async function(req) {
  const newUser = await userService.registerUser(req.body);
  return newUser;
});

common.api.post(router, "/login", async function(req) {
  const token = await userService.loginUser(req.body);
  return "Bearer " + token;
});

common.api.get(
  router,
  "/current",
  req => {
    return {
      name: req.user.name,
      email: req.user.email
    };
  },
  passport.authenticate("jwt", { session: false })
);

module.exports = router;
