FROM --platform=linux/amd64 node:18-alpine
    
WORKDIR /app
    
COPY package*.json ./
    
RUN npm install --legacy-peer-deps --python=/usr/bin/python3
    
COPY . .
    
EXPOSE 3000
    
CMD ["npm", "run", "dev"]
