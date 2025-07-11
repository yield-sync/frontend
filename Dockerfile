# At the top of Dockerfile
FROM node:20

# Go to app dir
WORKDIR /app

# Copy backend files from the local context into the image
COPY . .

# Install npm packages
RUN npm install

# Rebuild if something was pulled
RUN npm run build

# Expose the preview server port
EXPOSE 4173

# Start the preview server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]

# Start the preview server
CMD ["npm", "run", "health-check"]

# Expose the preview server port
EXPOSE 5173