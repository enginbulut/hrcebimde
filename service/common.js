"use strict";
const passport = require("passport");

const addDays = days => {
  let today = new Date();
  today.setDate(today.getDate() + days);
  return today;
};

const wrapError = (errors, errorCode) => {
  return {
    code: errorCode,
    isCustomError: true,
    errors: errors
  };
};
const publicPost = (router, url, callback, ...handlers) => {
  addRoute(router, "post", url, callback, handlers);
};

const publicGet = (router, url, callback, ...handlers) => {
  addRoute(router, "get", url, callback, handlers);
};

const publicDelete = (router, url, callback, ...handlers) => {
  addRoute(router, "del", url, callback, handlers);
};

const privatePost = (router, url, roleType, callback, ...handlers) => {
  handlers.push(passport.authenticate("jwt", { session: false }));
  addPrivateRoute(router, "post", url, roleType, callback, handlers);
};

const privateGet = (router, url, roleType, callback, ...handlers) => {
  handlers.push(passport.authenticate("jwt", { session: false }));
  addPrivateRoute(router, "get", url, roleType, callback, handlers);
};

const privateDelete = (router, url, roleType, callback, ...handlers) => {
  handlers.push(passport.authenticate("jwt", { session: false }));
  addPrivateRoute(router, "del", url, roleType, callback, handlers);
};

const catchErrors = callback => {
  return async function errorHandler(req, res, next) {
    try {
      await callback(req, res, next);
    } catch (ex) {
      if (ex.isCustomError) {
        res.json(response(null, ex.code, "", ex.errors));
      } else {
        res.json(response(null, 500, ex.toString(), ""));
      }
    }
    next();
  };
};

const addPrivateRoute = (
  router,
  httpMethod,
  url,
  roleType,
  callback,
  ...handlers
) => {
  router[httpMethod](
    url,
    handlers,
    catchErrors(async function(req, res) {
      if (roleType > req.user.role.permissioncode) res.send(401);
      else {
        const result = await callback(req);
        res.json(response(result));
      }
    })
  );
};

const addRoute = (router, httpMethod, url, callback, ...handlers) => {
  router[httpMethod](
    url,
    handlers,
    catchErrors(async function(req, res) {
      const result = await callback(req);
      res.json(response(result));
    })
  );
};

const response = (
  data = null,
  code = 200,
  message = "OK",
  detail = null,
  exception = null
) => {
  return {
    data: data,
    meta: {
      code: code,
      message: message,
      detail: detail,
      exception: exception
    }
  };
};

module.exports = {
  helper: { wrapError, response, addDays },
  api: {
    private: { post: privatePost, get: privateGet, delete: privateDelete },
    public: { post: publicPost, get: publicGet, delete: publicDelete }
  }
};
