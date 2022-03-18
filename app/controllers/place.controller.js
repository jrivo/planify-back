const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll = (req, res) => {
  prisma.place
    .findMany()
    .then((places) => {
      res.status(200).send(places);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.getById = (req, res) => {
  prisma.place
    .findUnique({
      where: { id: req.params.id },
    })
    .then((place) => {
      res.status(200).send(place);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.getByName = (req, res) => {
  prisma.place
    .findMany({
      where: { name: req.params.name },
    })
    .then((places) => {
      res.status(200).send(places);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.create = (req, res) => {
  prisma.place
    .create({
      data: {
        name: req.body.name,
        description: req.body.description,
        address: req.body.address,
        website: req.body.website,
        phone: req.body.phone,
        email: req.body.email,
        placeTypeId: req.body.placeTypeId,
        //ownerId retrieved from jwt in header
        owner: { connect: { id: req.userId } },
      },
    })
    .then((place) => {
      console.log("created");
      res.status(200).send(place);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.update = async (req, res) => {
  targetPlace = await prisma.place.findUnique({ where: { id: req.params.id } });
  if (targetPlace.ownerId === req.userId) {
    prisma.place
      .update({
        where: { id: req.params.id },
        data: {
          name: req.body.name,
          description: req.body.description,
          address: req.body.address,
          website: req.body.website,
          phone: req.body.phone,
          email: req.body.email,
          placeTypeId: req.body.placeTypeId,
        },
      })
      .then((place) => {
        res.status(200).send(place);
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
  targetPlace = await prisma.place.findUnique({ where: { id: req.params.id } });
  if (targetPlace.ownerId === req.userId) {
    prisma.place
      .delete({
        where: { id: req.params.id },
      })
      .then((place) => {
        res.status(200).send(place);
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
