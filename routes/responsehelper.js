"use strict";
const response = (
  data = null,
  code = 200,
  message = "OK",
  detail = null,
  exception = null,
  executionTime = 0
) => {
  return {
    data: data,
    executionTime: executionTime,
    meta: {
      code: code,
      message: message,
      detail: detail,
      exception: exception
    }
  };
};
module.exports = response;
