FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

COPY . .

RUN cd app; \
    npx prisma generate; \
    cd ..

EXPOSE 5000

CMD ["node", "server.js"]