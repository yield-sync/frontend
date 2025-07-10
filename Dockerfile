# At the top of Dockerfile
FROM node:20

# Install npm packages and rebuild if something was pulled
RUN npm install && npm run build
