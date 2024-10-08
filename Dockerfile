FROM node:22
WORKDIR /App

COPY ./package.json ./

RUN npm install

COPY . ./

CMD ["npm", "start"]
