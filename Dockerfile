# Use an official Node.js runtime as the base image
FROM node:20 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the Solid.js application (replace with your build command)
RUN npm run build

# Stage 2: Create a lightweight container with a Node.js server to serve the app
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy the built application from the previous stage into the container
COPY --from=build /app/dist /app

# Expose port 3000 for the Node.js server
EXPOSE 3000

# Install http-server globally (you can also add it as a dependency in your package.json)
RUN npm install -g http-server

# Start the Node.js server to serve th
CMD ["http-server", "-p", "3000", "-P", "http://localhost:3000?", "."]
