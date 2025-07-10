# At the top of Dockerfile
FROM node:20

# Go to app dir
WORKDIR /app

# Install npm packages and rebuild if something was pulled
RUN npm install && npm run build
