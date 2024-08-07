FROM node:20.11.1

WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm" , "start" ]
