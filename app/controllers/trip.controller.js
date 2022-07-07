const { PrismaClient } = require("@prisma/client");
const utils = require("../utils/utils");
const { getById } = require("./place.controller");
const prisma = new PrismaClient();

exports.getAll = (req, res) => {
  prisma.trip
    .findMany({ where: { userId: req.userId }, include: { activities: true } })
    .then((trips) => {
      res.status(200).send(trips);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.getById = (req, res) => {
  prisma.trip
    .findUnique({ where: { id: req.params.id }, include: { activities: true } })
    .then((trip) => {
      if (!utils.isAdmin && trip.userId !== req.userId) {
        res.status(403).send({
          message: "Unauthorized!",
        });
        return;
      } else res.status(200).send(trip);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.getByName = (req, res) => {
  prisma.trip
    .findMany({
      where: {
        AND: [{ userId: req.userId }, { name: req.params.name }],
      },
      include: { activities: true },
    })
    .then((trips) => {
      res.status(200).send(trips);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.create = (req, res) => {
  prisma.trip
    .create({
      data: {
        name: req.body.name,
        description: req.body.description,
        user: { connect: { id: req.userId } },
      },
    })
    .then((trip) => {
      res.status(201).send(trip);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.update = async (req, res) => {
  targetTrip = await prisma.trip.findUnique({ where: { id: req.params.id } });
  if (!utils.isAdmin && targetTrip.userId !== req.userId) {
    res.status(403).send({
      message: "Unauthorized!",
    });
    return;
  } else {
    prisma.trip
      .update({
        where: { id: req.params.id },
        include: { activities: true },
        data: {
          name: req.body.name,
          description: req.body.description,
        },
      })
      .then((trip) => {
        res.status(200).send(trip);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
};

exports.delete = async (req, res) => {
  targetTrip = await prisma.trip.findUnique({ where: { id: req.params.id } });
  if (!utils.isAdmin && targetTrip.userId !== req.userId) {
    res.status(403).send({
      message: "Unauthorized!",
    });
    return;
  } else {
    prisma.trip
      .delete({
        where: { id: req.params.id },
      })
      .then((trip) => {
        res.status(200).send(trip);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
};

exports.addActivity = async (req, res) => {
  targetTrip = await prisma.trip.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { activities: true },
  });
  if (!utils.isAdmin && targetTrip.userId !== req.userId) {
    res.status(403).send({
      message: "Unauthorized!",
    });
    return;
  } else {
    prisma.trip
      .update({
        where: { id: parseInt(req.params.id) },
        include: { activities: true },
        data: {
          activities: {
            connect: {
              id: parseInt(req.body.activityId),
            },
          },
        },
      })
      .then((trip) => {
        res.status(200).send(trip);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  }
};
