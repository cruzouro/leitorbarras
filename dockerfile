# Usa uma imagem base do Python
FROM python:3.11-slim

# Atualiza e instala dependências do sistema, incluindo o libzbar0
RUN apt-get update && \
    apt-get install -y libzbar0 && \
    rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de requisitos
COPY requirements.txt .

# Instala as dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código da aplicação para o contêiner
COPY . .

# Expõe a porta para acesso ao servidor Flask
EXPOSE 5000

# Executa o aplicativo
CMD ["python", "server.py"]
