# Start with the official Playwright image from Microsoft.
# This image already contains Node.js and all browser dependencies.
FROM mcr.microsoft.com/playwright:v1.44.1-jammy

# Set the working directory inside our "mini-computer"
WORKDIR /app

# Copy the package files to install dependencies first.
# This is a Docker optimization technique.
COPY package*.json ./

# Run the command to install your project's npm packages (express, mongoose, etc.)
RUN npm install

# Copy the rest of your application code (server.js, services/, etc.)
COPY . .

# This is the command that will be run when your server starts.
CMD ["node", "server.js"]