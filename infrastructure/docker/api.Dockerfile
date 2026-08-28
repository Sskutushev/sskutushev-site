FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
RUN --mount=type=cache,id=pnpm-api,target=/pnpm/store \
  pnpm config set store-dir /pnpm/store && pnpm install --frozen-lockfile
COPY prisma prisma
COPY apps/api apps/api
RUN pnpm prisma:generate && pnpm --filter @sskutushev/api build \
  && cp -R prisma apps/api/prisma \
  && pnpm --filter @sskutushev/api --prod deploy /prod
FROM node:22-alpine
RUN corepack enable
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /prod /app
USER node
EXPOSE 4000
CMD ["node", "dist/main.js"]
