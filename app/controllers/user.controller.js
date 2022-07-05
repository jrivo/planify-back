const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.changeRole = (req, res) => {
  prisma.user
    .update({
      where: { id: req.params.id },
      data: {
        role: req.body.role,
      },
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}