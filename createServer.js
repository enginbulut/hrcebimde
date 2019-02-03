const restify = require("restify");
const passport = require("passport");

const createServer = async port => {
  const router = getRouter();
  const server = restify.createServer({
    name: "HR Cebimde API",
    version: "1.0.0"
  });

  server.use(
    restify.plugins.throttle({
      burst: 100, // Max 100 concurrent requests (if tokens)
      rate: 2, // Steady state: 2 request / 1 seconds
      ip: true // throttle per IP
    })
  );

  server.use(restify.plugins.acceptParser(server.acceptable));
  server.use(restify.plugins.queryParser());
  server.use(restify.plugins.gzipResponse());
  server.use(restify.plugins.bodyParser());

  //passport middleware
  server.use(passport.initialize());
  //passport config
  require("./config/passport")(passport);

  router.applyRoutes(server);

  server.on(
    "after",
    restify.plugins.metrics({ server: server }, function onMetrics(
      err,
      metrics,
      req
    ) {})
  );

  server.listen(port, function() {
    console.log("%s listening at %s", server.name, server.url);
  });

  server.on("uncaughtException", function(req, res, route, ex) {
    console.log(err);
  });
};

const getRouter = () => {
  const router = new (require("restify-router")).Router();
  const index = require("./routes/index");
  const users = require("./routes/api/admin/users");
  const roles = require("./routes/api/admin/roles");
  const titles = require("./routes/api/admin/titles");
  const departments = require("./routes/api/admin/departments");
  const branches = require("./routes/api/admin/branches");
  const employees = require("./routes/api/admin/employees");

  router.add("/", index);
  router.add("/api/admin/users", users);
  router.add("/api/admin/roles", roles);
  router.add("/api/admin/titles", titles);
  router.add("/api/admin/departments", departments);
  router.add("/api/admin/branches", branches);
  router.add("/api/admin/employees", employees);

  return router;
};

module.exports = createServer;
