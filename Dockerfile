# At the top of Dockerfile
FROM node:20

# Install npm packages
RUN npm install && npm run build

# Rebuild if something was pulled
RUN npm install && npm run build
