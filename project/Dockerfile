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

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf
RUN rm -f /etc/nginx/nginx.conf

# Create non-root user and group
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Create necessary directories with correct permissions
RUN mkdir -p /tmp/nginx/client_temp && \
    mkdir -p /tmp/nginx/proxy_temp && \
    mkdir -p /tmp/nginx/fastcgi_temp && \
    mkdir -p /tmp/nginx/uwsgi_temp && \
    mkdir -p /tmp/nginx/scgi_temp && \
    mkdir -p /tmp/nginx/run && \
    chown -R appuser:appgroup /tmp/nginx && \
    chmod -R 755 /tmp/nginx

# Create a minimal nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Set proper permissions for nginx html directory
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R appuser:appgroup /etc/nginx && \
    chmod -R 755 /etc/nginx

# Switch to non-root user
USER appuser

# Expose port 8080
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]