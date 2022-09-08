intifyIds = (req, res, next) => {
  for (const key in req.body) {
    //if last two characters are "Id"
    if (key.slice(-2) === "Id") {
      req.body[key] = parseInt(req.body[key]);
    }
  }
  next();
};

const idMiddlewares = {
  intifyIds
};

module.exports = idMiddlewares;
