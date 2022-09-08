const { authJwt } = require("../middleware");
const controller = require("../controllers/placeType.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/place-types", controller.getAll);
  app.get("/place-types/:id", controller.getById);
  app.post("/place-types", [authJwt.verifyToken,authJwt.isAdmin],controller.create);
  app.put(
    "/place-types/:id",
    [authJwt.verifyToken],
    controller.update
  );
  app.delete(
    "/place-types/:id",
    [authJwt.verifyToken],
    controller.delete
  );
};
