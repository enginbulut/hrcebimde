const router = new (require("restify-router")).Router();
const utils = require("../../../service/utils");
const passport = require("passport");
const response = require("../../../routes/responsehelper");

//Load input validation
const validateRegisterInput = require("../../../validation/register");
const validateLoginInput = require("../../../validation/login");

//Load User model and user domain
const UserModel = require("../../../models/UserModel");
const User = require("../../../domain/user");

router.get("/test", (req, res, next) => {
  res.json(response({ msg: "Users Works" }));
  next();
});

router.post("/register", async (req, res, next) => {
  try {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
      res.json(response(null, 400, "", errors));
      next();
      return;
    }

    const user = await UserModel.getUserByEmail(req.body.email);

    if (user) {
      errors.email = "Email already exists";
      res.json(response(null, 400, "", errors));
      next();
      return;
    }

    const avatar = utils.getGravatar(req.body.email);
    var hashedPassword = utils.getHash(req.body.password);
    const newUser = new User(
      req.body.name,
      req.body.email,
      hashedPassword,
      avatar
    );

    await UserModel.save(newUser);
    res.json(response(newUser));
  } catch (ex) {
    res.json(response(null, 500, ex.toString(), ""));
  }

  next();
});

router.post("/login", async function(req, res, next) {
  try {
    console.log(req);
    const { errors, isValid } = validateLoginInput(req.body);
    //check validation
    if (!isValid) {
      res.json(response(null, 400, "", errors));
      next();
      return;
    }

    const email = req.body.email;
    const password = req.body.password;

    //find user by email
    const user = await UserModel.getUserByEmail(email);
    //check for user
    if (!user) {
      errors.email = "User email not found";
      res.json(response(null, 400, "", errors));
      next();
      return;
    }

    const isMatched = utils.compareHash(password, user.password);
    if (isMatched) {
      const payload = {
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }; //create JWT payload
      const token = utils.signPayload(payload);
      res.json(
        response({
          success: true,
          token: "Bearer " + token
        })
      );
    } else {
      errors.password = "Password incorrect";
      res.json(response(null, 400, "", errors));
    }
  } catch (ex) {
    res.json(response(null, 500, ex.toString(), ""));
  }

  next();
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({
      name: req.user.name,
      email: req.user.email
    });
    next();
  }
);

module.exports = router;
