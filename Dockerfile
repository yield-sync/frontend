# At the top of Dockerfile
FROM node:20

# Install npm packages
RUN npm install

# Rebuild if something was pulled
RUN npm run build
