"use strict";
const createServer = require("./createServer");
const { connect: connectMongo } = require("./dataaccess/mongo");

const createServers = async () => {
  const port = process.env.PORT || 5000;
  await createServer(port);
};

setImmediate(async () => {
  const mongoConnected = await connectMongo();
  const waitTimer = setInterval(async () => {
    if (mongoConnected) {
      clearInterval(waitTimer);
      await createServers();
    }
  }, 1000);
});
