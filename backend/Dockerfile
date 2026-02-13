FROM node:20-alpine

WORKDIR /app

# Копируем манифесты зависимостей
COPY package.json package-lock.json* tsconfig.json ./

# Ставим зависимости (включая dev, чтобы собрать TypeScript)
RUN npm install

# Остальной код бэкенда (src и прочее)
COPY . .

# Сборка TypeScript в папку dist
RUN npm run build

# Порт Express-приложения
EXPOSE 4000

# Запуск через npm-скрипт
CMD ["npm", "start"]

