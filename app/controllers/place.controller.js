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
      where: { id: parseInt(req.params.id) },
      include: { activities: true },
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
      where: {
        name: {
          search: req.params.name,
        },
      },
    })
    .then((places) => {
      res.status(200).send(places);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.create = (req, res) => {
  prisma.address
    .create({
      data: {
        street: req.body.street,
        streetNumber: req.body.streetNumber,
        city: req.body.city,
        postalCode: req.body.postalCode,
        country: req.body.country,
        region: req.body.region,
      },
    })
    .then((address) => {
      prisma.place
        .create({
          data: {
            name: req.body.name,
            description: req.body.description,
            address: { connect: { id: address.id } },
            website: req.body.website,
            phone: req.body.phone,
            email: req.body.email,
            type: { connect: { id: req.body.placeTypeId } },
            owner: { connect: { id: req.userId } },
          },
        })
        .then((place) => {
          console.log("created");
          res.status(200).send(place);
        })
        .catch((err) => {
          prisma.address.delete({ where: { id: address.id } });
          console.log(err);
          res.status(500).send(err);
        });
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

exports.createActivity = async (req, res) => {
  targetPlace = await prisma.place.findUnique({ where: { id: req.params.id } });
  if (targetPlace.ownerId != req.userId) {
    res.status(403).send({
      message: "You are not authorized to perform this action!",
    });
    return;
  }
  prisma.activity
    .create({
      data: {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        place: { connect: { id: req.params.id } },
        //TODO: add medias, dates, etc.
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

exports.getActivities = async (req, res) => {
  prisma.activity
    .findMany({ where: { placeId: req.params.id } })
    .then((activities) => {
      res.status(200).send(activities);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

//TODO: myPlaces
