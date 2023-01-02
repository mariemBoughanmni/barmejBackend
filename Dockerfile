FROM node:18
LABEL maintainer="Dockerfile Maintainers <olfa.jlali@esprit.tn>"
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node
COPY package*.json ./
RUN npm install
RUN npm install bcrypt
COPY . .
EXPOSE 3000
CMD [ "node", "app.js" ]
