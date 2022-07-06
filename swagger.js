const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./app/routes/auth.routes','./app/routes/user.routes','./app/routes/place.routes','./app/routes/trip.routes','./app/routes/placeType.routes','./app/routes/activity.routes']

swaggerAutogen(outputFile, endpointsFiles)