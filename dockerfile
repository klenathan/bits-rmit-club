FROM node:18

# Create app directory
WORKDIR /src/app


COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]