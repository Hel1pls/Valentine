FROM node:20-alpine

WORKDIR /app

# Скопируй сюда свой backend/package.json и backend/package-lock.json
COPY package.json package-lock.json* ./

RUN npm install --production

# Остальной код бэкенда
COPY . .

# Порт Express-приложения
EXPOSE 4000

# ВАЖНО: замени команду ниже на свою реальную команду запуска (см. scripts в backend/package.json)
# Например:
#   "start": "node dist/index.js"
# тогда CMD будет ["npm", "start"]
CMD ["node", "index.js"]

