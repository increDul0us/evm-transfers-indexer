FROM node:20.11.1-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3333

CMD [  "npm", "run", "start" ]