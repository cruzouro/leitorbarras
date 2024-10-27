FROM python:3.11-slim

# Instala o libzbar
RUN apt-get update && apt-get install -y libzbar0 && rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY . .

# Instala as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Comando para iniciar o aplicativo
CMD ["gunicorn", "server:app", "--bind", "0.0.0.0:8000"]
