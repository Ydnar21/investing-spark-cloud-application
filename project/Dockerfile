# Build stage
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Add package files
COPY package*.json ./

# Install dependencies with clean npm install
RUN npm ci

# Add source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Add nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Add non-root user
RUN adduser -D -H -u 1001 -s /sbin/nologin www-data

# Set proper permissions
RUN chown -R www-data:www-data /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R www-data:www-data /var/cache/nginx && \
    chown -R www-data:www-data /var/log/nginx && \
    chown -R www-data:www-data /etc/nginx/conf.d

# Switch to non-root user
USER www-data

# Expose port 8080 (non-privileged)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]