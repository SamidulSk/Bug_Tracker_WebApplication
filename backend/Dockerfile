FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy all source code
COPY . .

# Expose backend port
EXPOSE 4005

# Start server using start script
CMD ["npm", "start"]
