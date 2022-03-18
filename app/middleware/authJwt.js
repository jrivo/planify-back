const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
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

isModeratorOrAdmin = (req, res, next) => {
  prisma.user.findUnique({ where: { id: req.userId } }).then((user) => {
    if (user.role === "ADMIN") {
      next();
      return;
    }
    if (user.role === "MODERATOR") {
      next();
      return;
    }
    res.status(403).send({
      message: "Require Admin or Moderator Role!",
    });
    return;
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin,
};
module.exports = authJwt;
