# Use Node.js LTS Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application source code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S restaurant && \
    adduser -S appuser -u 1001 -G restaurant

# Change ownership of app directory
RUN chown -R appuser:restaurant /app

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 3000

# Add health check for container monitoring
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node healthcheck.js || exit 1

# Start the application
CMD ["node", "server.js"]
