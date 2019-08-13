FROM node:10
# Create app directory
WORKDIR /app
COPY package*.json /app/server

RUN cd server && npm install
# If you are building your code for production
# RUN npm ci --only=production

COPY . /app

EXPOSE 7000
CMD [ "node", "server.js" ]