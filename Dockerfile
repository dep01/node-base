FROM ubuntu:lts
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm config set registry https://registry.npmjs.org

RUN npm install -g typescript\
    sequelize-cli\
    ts-node
RUN npm install

# Copy the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Define the command to run your app

CMD ["npm", "start"]