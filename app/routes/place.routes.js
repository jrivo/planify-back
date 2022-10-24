const { authJwt, url, files, ids } = require("../middleware");
const controller = require("../controllers/place.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/places", controller.getAll);
  app.get("/places/:id", controller.getById);
  app.get("/places/search/:name", controller.getByName);
  app.get(
    "/places/:id/activities",
    [authJwt.verifyToken, url.intifyId],
    controller.getActivities
  );
  app.post("/places", [authJwt.verifyToken,ids.intifyIds], controller.create);
  app.post(
    "/places/:id/create-activity",
    [authJwt.verifyToken, url.intifyId],
    controller.createActivity
  );
  app.put("/places/:id", [authJwt.verifyToken], controller.update);
  app.delete("/places/:id", [authJwt.verifyToken,url.intifyId], controller.delete);
};
