const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

verifyToken = (req, res, next) => {
  let token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

isAdmin = (req, res, next) => {
  prisma.user.findUnique({ where: { id: req.userId } }).then((user) => {
    if (user.role === "ADMIN") {
      next();
      return;
    }
    res.status(403).send({
      message: "Require Admin Role!",
    });
    return;
  });
};

isModerator = (req, res, next) => {
  prisma.user.findUnique({ where: { id: req.userId } }).then((user) => {
    if (user.role === "MODERATOR") {
      next();
      return;
    }
    res.status(403).send({
      message: "Require Moderator Role!",
    });
    return;
  });
};
//TODO: do the same for other roles checking
isModeratorOrAdmin = (req, res, next) => {
  prisma.user.findUnique({ where: { id: req.userId } }).then((user) => {
    if (user.role === "ADMIN" || user.role === "MODERATOR") {
      next();
    } else {
      res.status(403).send({
        message: "Require Admin or Moderator Role!",
      });
      return;
    }
  });
};

isOwner = (req, id) => {
  return req.userId == id;
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

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  isModeratorOrAdmin,
};
module.exports = authJwt;
