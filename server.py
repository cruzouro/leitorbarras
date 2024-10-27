from flask import Flask, render_template, request, jsonify, session
import csv
from PIL import Image
from pyzbar.pyzbar import decode

app = Flask(__name__)
app.secret_key = "supersecretkey"  # Necessário para usar sessões

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/loading')
def loading():
    return render_template('loading.html')

@app.route('/modal')
def modal():
    return render_template('modal.html')

@app.route('/retry')
def retry():
    return render_template('retry.html')

@app.route('/scan', methods=['POST'])
def scan():
    data = request.get_json()
    code = data.get('code', '')

    # Inicializa a contagem de tentativas na sessão, se não estiver definida
    if 'attempts' not in session:
        session['attempts'] = 0

    # Verificar se o código está no arquivo codebar.csv
    try:
        with open('codebar.csv', 'r', newline='',encoding='utf-8') as file:
            reader = csv.DictReader(file)
            codes = {row['codigo']: row['descricao'] for row in reader}
    except Exception as e:
        return jsonify({"message": "Erro ao ler o arquivo", "error": str(e)})

    # Verifica se o código está na lista de códigos
    if code in codes:
        response_message = {"message": "Item: ", "code": code, "descricao": codes[code]}
        session['attempts'] = 0  # Reseta as tentativas ao encontrar o código
    else:
        session['attempts'] += 1  # Incrementa as tentativas em caso de Reposicione o produto
        if session['attempts'] >= 10:
            response_message = {"message": "Código não localizado após 10 tentativas."}
            session['attempts'] = 0  # Reseta a contagem de tentativas após a décima tentativa falha
        else:
            response_message = {"message": "Reposicione o produto.", "attempts": session['attempts']}

    print("Código recebido:", code)
    return jsonify(response_message)

@app.route('/item/<code>', methods=['GET'])
def item_detail(code):
    try:
        with open('codebar.csv', 'r', newline='',encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row['codigo'] == code:
                    return render_template('item_detail.html', item=row)
    except Exception as e:
        return f"Erro ao ler o arquivo: {str(e)}"
    
    return "Produto não cadastrado."

@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        # Recebe a imagem como arquivo
        image_file = request.files.get('image')
        # Verifica se o arquivo foi enviado
        if image_file is None or image_file.filename == '':
            return jsonify({'error': 'Nenhum arquivo selecionado.'}), 400
        
        # Converte a imagem recebida em um objeto PIL
        imagem = Image.open(image_file)

        imagem = imagem.convert("L")

        # Decodifica os códigos de barras
        codigos_barras = decode(imagem)

        if len(codigos_barras) > 0:
            codigo = codigos_barras[0].data.decode("utf-8")
            print("Código de barras identificado:", codigo)

            # Verifica se o código está no arquivo codebar.csv
            try:
                with open('codebar.csv', 'r', newline='', encoding='utf-8') as file:
                    reader = csv.DictReader(file)
                    codes = {row['codigo']: row['descricao'] for row in reader}
            except Exception as e:
                return jsonify({"message": "Erro ao ler o arquivo", "error": str(e)})

            # Se o código estiver no CSV, retorna a URL do item
            if codigo in codes:
                return jsonify({
                    'message': 'Código de barras identificado',
                    'codigo': codigo,
                    'url': f'/item/{codigo}'  # URL para a rota de detalhes
                })
            else:
                # Se o código não estiver no CSV, redireciona para a página não encontrado
                return jsonify({
                    'message': 'Código não encontrado.',
                    'url': f'/item/{codigo}/naoencontrado'  # URL para a página de não encontrado
                })

        else:
            print("Nenhum código de barras identificado.")
            return jsonify({'message': 'Nenhum código de barras identificado.'})

    except Exception as e:
        print("Erro ao processar a imagem:", e)
        return jsonify({'error': 'Erro ao processar a imagem.'}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
