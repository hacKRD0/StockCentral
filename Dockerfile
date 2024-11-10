# Backend Dockerfile

# Start with a Node image
FROM node:20

# Create app/backend directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the backend port
EXPOSE 80

# Start the backend server
CMD ["npm", "run", "dev"]
