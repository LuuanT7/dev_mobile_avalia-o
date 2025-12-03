FROM node:20-alpine

WORKDIR /app

# install deps
COPY package.json package-lock.json* ./
RUN apk add --no-cache libc6-compat git &&     npm ci --legacy-peer-deps || npm install

# copy source
COPY . .

# generate prisma client and push schema to DB at container start
ENV NODE_ENV=development
EXPOSE 3000

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run dev"]
