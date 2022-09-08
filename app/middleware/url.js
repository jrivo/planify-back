intifyId = (req, res, next) => {
  if (req.params.id) {
    req.params.id = parseInt(req.params.id);
  }
  next();
};

// getUserId = (req) => {
//   if (req.headers && req.headers.authorization) {
//     var authorization = req.headers.authorization.split(" ")[1],
//       decoded;
//     try {
//       decoded = jwt.verify(authorization, config.secret);
//     } catch (e) {
//       console.log(e);
//       return res.status(401).send("unauthorized");
//     }
//     return decoded.id;
//   }
// };

const urlMiddlewares = {
  intifyId
};

module.exports = urlMiddlewares;
