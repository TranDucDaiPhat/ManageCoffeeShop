# --- Build stage ---
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build  # ✅ build React app

# --- Production stage ---
FROM node:20-alpine AS runner

WORKDIR /app

# Cài đặt web server như serve hoặc express nếu cần
RUN npm install -g serve

# Copy chỉ cần thư mục build
COPY --from=builder /app/build ./build

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
