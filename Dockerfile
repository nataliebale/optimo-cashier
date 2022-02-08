FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=prod 
RUN npm install edge-js
COPY ./dist ./dist
COPY ./app ./app
COPY ./bin ./bin
COPY ormconfig.js ./
EXPOSE 8899
CMD ["node", "app/socket-io/main.js"]