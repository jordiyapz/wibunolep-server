FROM node:10

# Create app directory
WORKDIR /app/server
COPY package*.json .

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

COPY ../client /app/client

EXPOSE 7000
CMD [ "node", "server.js" ]