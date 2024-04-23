FROM node:20.11.0-alpine

RUN mkdir -p /var/app

WORKDIR /var/app

COPY . .

RUN npm i

ENTRYPOINT [ "npm", "run", "start:dev" ]
