FROM node:24-alpine

# Update package manager and install dependencies if needed
RUN apk update && apk upgrade
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
