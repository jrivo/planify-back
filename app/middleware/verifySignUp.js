const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

checkDuplicateUsernameOrEmail = (req, res, next) => {
  console.log(req.body);
  // Username
  prisma.user
    .findUnique({ where: { username: req.body.username } })
    .then((user) => {
      if (user) {
        res.status(400).send({
          message: "Failed! Username is already in use!",
        });
        return;
      }
      // Email
      prisma.user
        .findUnique({ where: { email: req.body.email } })
        .then((user) => {
          if (user) {
            res.status(400).send({
              message: "Failed! Email is already in use!",
            });
            return;
          }
          next();
        });
    });
};
const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};
module.exports = verifySignUp;
