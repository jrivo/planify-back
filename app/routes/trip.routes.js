const { authJwt } = require("../middleware");
const controller = require("../controllers/trip.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/trips", [authJwt.verifyToken],controller.getAll);
  app.get("/trips/:id", [authJwt.verifyToken],controller.getById);
  app.get("/trips/search/:name", controller.getByName);
  app.post("/trips", [authJwt.verifyToken],controller.create);
  app.post("/trips/:id/add-activity", [authJwt.verifyToken],controller.addActivity);
  app.put(
    "/trips/:id",
    [authJwt.verifyToken],
    controller.update
  );
  app.delete(
    "/trips/:id",
    [authJwt.verifyToken],
    controller.delete
  );
};
