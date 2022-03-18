const { authJwt } = require("../middleware");
const controller = require("../controllers/place.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/place/all", controller.getAll);
  app.get("/place/:id", controller.getById);
  app.get("/place/search/:name", controller.getByName);
  app.post("/place/create", [authJwt.verifyToken],controller.create);
  app.post(
    "/place/update/:id",
    [authJwt.verifyToken],
    controller.update
  );
  app.post(
    "/place/delete/:id",
    [authJwt.verifyToken],
    controller.delete
  );
};
