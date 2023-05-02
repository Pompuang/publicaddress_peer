FROM node:16-alpine3.15
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
RUN npm install --save-dev nodemon
COPY . .
EXPOSE 3030
CMD [ "npm","run","dev"]