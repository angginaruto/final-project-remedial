# Gunakan Node.js versi 22 (dibutuhkan oleh Prisma 7)
FROM node:22-slim

# Install dependencies yang dibutuhkan Prisma (openssl)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copy package files dulu biar layer caching lebih efisien
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

# Install semua dependencies (termasuk devDependencies buat build)
RUN npm install

# Copy semua source code
COPY . .

# Dummy DATABASE_URL cuma buat proses build (prisma generate gak beneran
# connect ke database, cuma butuh env var ini "ada" biar config gak error).
# DATABASE_URL asli tetap diambil dari environment variable Back4app saat runtime.
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=${DATABASE_URL}

# Generate Prisma Client (dibutuhkan biar tsc bisa nemu type dari @prisma/client)
RUN npx prisma generate

# Compile TypeScript ke JavaScript (folder dist/)
RUN npm run build

# Expose port (Back4app expects port 5000 by default)
EXPOSE 5000

# Jalankan migrasi Prisma (pakai DATABASE_URL asli dari runtime env), lalu start server
CMD npx prisma migrate deploy && npm start