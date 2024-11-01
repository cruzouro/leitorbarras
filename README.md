# leitorbarras

# Leitor de Códigos de Barras

Um sistema simples para leitura de códigos de barras, captura de imagens e exibição de detalhes dos itens. O projeto utiliza **Flask** no backend, **QuaggaJS** para leitura de códigos de barras e **Pillow (PIL)** juntamente com **pyzbar** para tratamento de imagens.

## Tecnologias Utilizadas

- **HTML**: Estrutura da interface do usuário.
- **CSS**: Estilos e layout do aplicativo.
- **JavaScript**: Interatividade e manipulação da DOM, utilizando QuaggaJS para leitura de códigos de barras.
- **Python**: Backend utilizando Flask.
- **Pillow (PIL)**: Para manipulação de imagens.
- **pyzbar**: Para leitura de códigos de barras em imagens processadas.
- **CSV**: Arquivo com exemplos de códigos de barras.

## Estrutura do Projeto

/leitorbarras │ ├── static/ │ ├── global.css # Estilos globais │ ├── index.css # Estilos para a página principal │ ├── retry.css # Estilos para a página de captura │ ├── item_detail.js # Lógica para exibir detalhes do item │ └── retry.js # Lógica para captura de imagem │ ├── templates/ │ ├── index.html # Página principal │ ├── modal.html # Modal para leitura de códigos de barras │ ├── retry.html # Página para busca manual │ └── item_detail.html # Página para exibir detalhes do item │ ├── data/ │ └── exemplos.csv # Arquivo CSV com códigos de barras de exemplo │ ├── README.md # Este arquivo └── server.py # Código do servidor Flask


## Como Usar

1. **Instalação**:
   - Certifique-se de que você tem Python instalado.
   - Instale as dependências necessárias usando o seguinte comando:
     ```bash
     pip install Flask Pillow pyzbar
     ```

2. **Iniciar o Servidor**:
   - Execute o servidor Python:
     ```bash
     python server.py
     ```

3. **Acessar o Aplicativo**:
   - Abra o navegador e vá para `http://localhost:5000` (ou outra porta se você a configurou).

## Funcionalidades

- Captura de imagens através da câmera do dispositivo.
- Leitura de códigos de barras utilizando QuaggaJS e, em caso de falha, processamento da imagem com Pillow e pyzbar.
- Exibição de informações sobre os produtos.
- Interface amigável para busca de produtos.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir um pull request ou relatar problemas.

## Licença

Este projeto é licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
