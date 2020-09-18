FROM node:10
COPY package.json /src/package.json
RUN cd /src; npm install; npm i nodemon -g
COPY . /src
EXPOSE 3000
WORKDIR /src

CMD npm start
