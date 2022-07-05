const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const urlMiddleware = require("./app/middleware/url");
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.json({ message: "Welcome to planify-backend" });
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/place.routes')(app);
require('./app/routes/trip.routes')(app);
require('./app/routes/placeType.routes')(app);
require('./app/routes/activity.routes')(app);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
