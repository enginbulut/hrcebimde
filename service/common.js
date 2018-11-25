"use strict";
const passport = require("passport");

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

const privatePost = (router, url, callback, ...handlers) => {
  handlers.push(passport.authenticate("jwt", { session: false }));
  addRoute(router, "post", url, callback, handlers);
};

const privateGet = (router, url, callback, ...handlers) => {
  handlers.push(passport.authenticate("jwt", { session: false }));
  addRoute(router, "get", url, callback, handlers);
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
  helper: { wrapError, response },
  api: {
    private: { post: privatePost, get: privateGet },
    public: { post: publicPost, get: publicGet }
  }
};
