# Use an official Node.js runtime as the base image for building
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy pnpm lockfile and package.json for dependency installation
COPY pnpm-lock.yaml package.json ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile --verbose

# Copy all files into the working directory
COPY . .

# Build the Next.js app
RUN pnpm build

# Use a minimal Node.js runtime for the production image
FROM node:20-alpine AS runner

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy built files and necessary dependencies from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules

# Set the environment variable to production
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["pnpm", "start"]
