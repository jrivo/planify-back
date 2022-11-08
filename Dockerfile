FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn build

RUN cd app; \
    npx prisma generate --schema=./src/prisma/schema.prisma; \
    cd ..

EXPOSE 5000

CMD [ "node", "dist/main.js" ]