# Start with the official Playwright image from Microsoft.
# This version now matches the version in your package.json.
FROM mcr.microsoft.com/playwright:v1.54.2-jammy

# Set the working directory inside our "mini-computer"
WORKDIR /app

# Copy the package files to install dependencies first.
COPY package*.json ./

# Run the command to install your project's npm packages
RUN npm install

# Copy the rest of your application code
COPY . .

# This is the command that will be run when your server starts.
CMD ["node", "server.js"]