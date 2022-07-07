const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll = (req, res) => {
  prisma.review
    .findMany()
    .then((reviews) => {
      res.status(200).send(reviews);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.getById = (req, res) => {
  prisma.review
    .findUnique({
      where: { id: req.params.id },
    })
    .then((review) => {
      res.status(200).send(review);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

// exports.create = (req, res) => {
//   prisma.review
//     .create({
//       data: {
//         author: { connect: { id: req.userId } },
//         rating: req.body.rating,
//         description: req.body.description,
//         placeId: req.body.placeId,
//         reviewStatusId: 0,
//       },
//     })
//     .then((review) => {
//       res.status(201).send(review);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send(err);
//     });
// };

exports.update = async (req, res) => {
  targetReview = await prisma.review.findUnique({ where: { id: req.params.id } });
  if (targetReview.ownerId === req.userId) {
    prisma.review
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
      .then((review) => {
        res.status(200).send(review);
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
  targetReview = await prisma.review.findUnique({ where: { id: req.params.id } });
  if (targetReview.ownerId === req.userId) {
    prisma.review
      .delete({
        where: { id: req.params.id },
      })
      .then((review) => {
        res.status(200).send(review);
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
