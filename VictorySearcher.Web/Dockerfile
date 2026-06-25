FROM node:22-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 5173
# Serve the built assets via Vite's Node preview server.
# /api is proxied to the backend (target set via VITE_API_PROXY_TARGET).
CMD ["npm", "run", "preview"]
