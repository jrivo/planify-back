const config = require("../config/auth.config");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const authJwt = require("../middleware/authJwt");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.register = (req, res) => {
  prisma.user
    .create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        role: req.body.role,
        //TODO: set userStatus + handle email verification
      },
    })
    .then(() => res.send({ message: "User was registered successfully!" }))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.login = (req, res) => {
  console.log(req.body)
  prisma.user
    .findFirst({where: {email: req.body.email}})
    .then((user) => {
      console.log(user)
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });
      res.status(200).send({
        id: user.id,
        email: user.email,
        role: user.role,
        accessToken: token,
      });
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send({ message: err.message });
    });
};

exports.me = (req, res) => {
    prisma.user
      .findUnique({
        where: { id: req.userId },
      })
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  return res.status(500);
};
