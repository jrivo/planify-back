const { PrismaClient } = require("@prisma/client");
const authConfig = require("../config/auth.config");
const utils = require("../utils/utils");
const prisma = new PrismaClient();

exports.getAll = (req, res) => {
  prisma.placeType
    .findMany()
    .then((types) => {
      res.status(200).send(types);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.getById = (req, res) => {
  prisma.placeType
    .findUnique({
      where: { id: req.params.id },
    })
    .then((type) => {
      res.status(200).send(type);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.create = (req, res) => {
  if (!utils.isAdmin) {
    res.status(403).send({
      message: "You are not authorized to perform this action!",
    });
    return;
  }
  prisma.placeType
    .create({
      data: {
        name: req.body.name,
      },
    })
    .then((type) => {
      console.log("created");
      res.status(200).send(type);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.update = async (req, res) => {
  targetPlace = await prisma.placeType.findUnique({
    where: { id: req.params.id },
  });
  if (utils.isAdmin) {
    prisma.placeType
      .update({
        where: { id: req.params.id },
        data: {
          name: req.body.name,
        },
      })
      .then((type) => {
        res.status(200).send(type);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } else {
    res.status(403).send({
      message: "You are not authorized to perform this action!",
    });
  }
};

exports.delete = async (req, res) => {
  targetPlace = await prisma.placeType.findUnique({
    where: { id: req.params.id },
  });
  if (utils.isAdmin) {
    prisma.placeType
      .delete({
        where: { id: req.params.id },
      })
      .then((type) => {
        res.status(200).send(type);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } else {
    res.status(403).send({
      message: "You are not authorized to perform this action!",
    });
  }
};
