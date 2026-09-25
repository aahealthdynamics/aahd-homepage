FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

# Remove default nginx static assets.
RUN rm -rf ./*

# Server config: gzip, cache headers, 404 page.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static site into the container.
COPY . .

# Expose nginx default HTTP port.
EXPOSE 80
