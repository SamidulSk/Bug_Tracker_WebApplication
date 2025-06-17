FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all frontend files
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Enable hot reload with polling 
ENV CHOKIDAR_USEPOLLING=true

# Start Vite dev server
CMD ["npm", "run", "dev"]
