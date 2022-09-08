const { PrismaClient } = require("@prisma/client");
const utils = require("../utils/utils");
const prisma = new PrismaClient();

exports.getAll = (req, res) => {
  prisma.activity
    .findMany({ include: { place: true } })
    .then((activities) => {
      res.status(200).send(activities);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

// exports.getByPlace = (req, res) => {
//   prisma.activity
//     .findMany({ where: { placeId: req.params.id } })
//     .then((activities) => {
//       res.status(200).send(activities);
//     })
//     .catch((err) => {
//       res.status(500).send(err);
//     });
// };

exports.getById = (req, res) => {
  prisma.activity
    .findUnique({
      where: { id: parseInt(req.params.id) },
      include: { place: true },
    })
    .then((activity) => {
      res.status(200).send(activity);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.getByName = (req, res) => {
  prisma.activity
    .findMany({
      where: {
        name: {
          search: req.params.name,
        },
      },
    })
    .then((activity) => {
      res.status(200).send(activity);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.update = async (req, res) => {
  targetActivity = await prisma.activity.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { place: true },
  });
  if (
    !utils.isModeratorOrAdmin &&
    targetActivity.place.ownerId != req.userId
  ) {
    res.status(403).send({
      message: "You are not authorized to perform this action!",
    });
    return;
  } else {
    prisma.activity
      .update({
        where: { id: parseInt(req.params.id) },
        data: {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          //TODO: add date modification with date picker
        },
      })
      .then((activity) => {
        res.status(200).send(activity);
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send(err);
      });
  }
};

exports.delete = async (req, res) => {
  targetActivity = await prisma.activity.findUnique({
    where: { id: req.params.id },
    include: { place: true },
  });
  if (
    !utils.isModeratorOrAdmin &&
    targetActivity.place.ownerId != req.userId
  ) {
    res.status(403).send({
      message: "You are not authorized to perform this action!",
    });
    return;
  } else {
    prisma.activity
      .delete({
        where: { id: req.params.id },
      })
      .then((activity) => {
        res.status(200).send(activity);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
};

//TODO: Create and get reviews
