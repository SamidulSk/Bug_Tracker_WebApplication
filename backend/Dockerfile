FROM node

# Set working directory inside container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all backend code to container
COPY . .

# Copy .env file
COPY .env .env

# Expose the backend port
EXPOSE 4001

# Start the server (if entry point is backend/index.js)
CMD ["node", "backend/index.js"]
