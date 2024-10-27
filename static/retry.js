function goBack() {
window.location.href = '/'; // Redireciona para a página inicial
}

const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const mensagemDiv = document.getElementById("mensagem");

// Acesso à câmera
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } })
.then(stream => {
videoElement.srcObject = stream;
})
.catch(error => {
console.error("Erro ao acessar a câmera:", error);
});

// Captura e envio da imagem
captureButton.addEventListener('click', async () => {
captureButton.classList.add('consultando');
captureButton.innerText = "Aguarde...";

// Atraso para estabilizar a imagem
await new Promise(resolve => setTimeout(resolve, 500));

const context = canvasElement.getContext('2d');
canvasElement.width = videoElement.videoWidth;
canvasElement.height = videoElement.videoHeight;
context.drawImage(videoElement, 0, 0);

const imageData = canvasElement.toDataURL('image/png');
const response = await fetch(imageData);
const blob = await response.blob();

const formData = new FormData();
formData.append('image', blob, 'captured-image.png');

fetch('/upload', {
method: 'POST',
body: formData
})
.then(response => {
if (!response.ok) throw new Error('Erro na resposta do servidor');
return response.json();
})
.then(data => {
// Verifica se o servidor retornou uma URL
if (data && data.url && data.url.includes("naoencontrado")) {
mensagemDiv.innerText = "Código não encontrado. Tente novamente.";
mensagemDiv.style.display = "block"; // Torna a mensagem visível

// Limpa a mensagem após 4 segundos
setTimeout(() => {
mensagemDiv.style.display = "none"; // Oculta a mensagem
resetButton();
}, 4000);
} else if (data && data.url) {
// Redireciona para a URL do item
window.location.href = data.url;
} else {
// Caso de erro de leitura ou resposta indefinida
mensagemDiv.innerText = "Erro de leitura. Tente novamente.";
mensagemDiv.style.display = "block"; // Torna a mensagem visível

// Limpa a mensagem após 4 segundos
setTimeout(() => {
mensagemDiv.style.display = "none"; // Oculta a mensagem
resetButton();
}, 4000);
}
})

.catch(error => {
console.error('Erro ao enviar a imagem:', error);
mensagemDiv.innerText = "Erro ao enviar a imagem. Tente novamente.";
mensagemDiv.style.display = "block"; // Torna a mensagem visível

// Limpa a mensagem após 3 segundos
setTimeout(() => {
mensagemDiv.style.display = "none"; // Oculta a mensagem
resetButton();
}, 4000);
});
});

// Função para restaurar o botão
function resetButton() {
captureButton.classList.remove('consultando');
captureButton.innerText = "Nova busca"; // Muda o Texto do Botão para Nova Busca
captureButton.style.backgroundColor = "#0980af"; // Muda a cor do botão para azul

}
