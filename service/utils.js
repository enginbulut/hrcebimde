"use strict";
const Guid = require("guid");
const moment = require("moment");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const keys = require("../config/keys");
const jwt = require("jsonwebtoken");

const RoleType = Object.freeze({
  Guest: 0,
  Employee: 1,
  Manager: 2,
  HR: 3,
  Admin: 4,
  SuperAdmin: 5
});

const getGravatar = email => {
  const avatar = gravatar.url(email, {
    s: "200", //Size
    r: "pg", //Rating
    d: "mm" //default
  });
  return avatar;
};

const getHash = password => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

const compareHash = (item1, item2) => {
  const isMatched = bcrypt.compareSync(item1, item2);
  return isMatched;
};

const signPayload = payload => {
  //sign token
  const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 });
  return token;
};

module.exports = {
  getGravatar,
  getHash,
  compareHash,
  signPayload,
  RoleType
};
