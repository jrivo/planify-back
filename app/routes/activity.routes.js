const { authJwt } = require("../middleware");
const controller = require("../controllers/activity.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/activities", controller.getAll);
  app.get("/activities/:id", controller.getById);
  app.get("/activities/search/:name", controller.getByName);
  app.put(
    "/activities/:id",
    [authJwt.verifyToken],
    controller.update
  );
  app.delete(
    "/activities/:id",
    [authJwt.verifyToken],
    controller.delete
  );
};
