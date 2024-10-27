function goBack() {
window.location.href = '/'; // Redireciona para a página inicial
}
let redirectTimeout;
let attempts = 0;

function startQuagga() {
Quagga.init({
inputStream: {
name: "Live",
type: "LiveStream",
target: document.querySelector("#interactive"),
},
decoder: {
readers: ["code_128_reader", "ean_reader", "ean_8_reader", "upc_reader"],
}
}, function(err) {
if (err) {
console.error("Erro ao inicializar o Quagga:", err);
document.getElementById('mensagem').innerText = "Erro ao acessar a câmera. Verifique as permissões.";
return;
}
console.log("Iniciando o Quagga...");
Quagga.start();
});
}

function openRetry() {
window.location.href = '/retry'; // Redireciona para a página de retry
}

startQuagga(); // Inicia a leitura assim que a página carregar

Quagga.onDetected(function(data) {
clearTimeout(redirectTimeout); // Cancela o redirecionamento automático
const code = data.codeResult.code;
document.getElementById('mensagem').innerText = "Reposicione o produto: " + code;

// Tentativa de localizar o item repetidamente
fetch('/scan', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ code: code }),
})
.then(response => response.json())
.then(data => {
if (data.message === "Item: ") {
window.location.href = '/item/' + code; // Redireciona para a página do item
} else {
document.getElementById('mensagem').innerText = "Código não localizado ou não cadastrado.";
if (attempts < 6) { // Limite de tentativas para evitar loop infinito
attempts++;
setTimeout(() => Quagga.start(), 1000); // Tenta novamente após 1 segundo
} else {
redirectTimeout = setTimeout(() => {
openRetry(); // Redireciona após 10 segundos
}, 5000); // 10 segundos
}
}
})
.catch(error => {
console.error('Erro:', error);
document.getElementById('mensagem').innerText = "Erro ao processar o código. Tente novamente.";
// Redirecionamento após erro
redirectTimeout = setTimeout(() => {
openRetry();
}, 5000);
});
});

// Inicia o redirecionamento automático após 10 segundos
redirectTimeout = setTimeout(() => {
openRetry();
}, 5000);
