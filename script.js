const startDate = new Date('2025-08-14T00:00:00');
const messages = [
    "¿Sabes la diferencia entre una cerveza y una cereza?,",
    "Que tu eres la que más besa.",
    "Escuche mi corazón latir y recorder estar vivo...",
    "Escuche tu corazón latir y comprendi porque estoy vivo..",
    "Gracias por hacerme tan feliz.\nTe quiero ♥️"
];

const introScreen = document.getElementById('intro-screen');
const heartBtn = document.getElementById('heart-btn');
const drop = document.getElementById('drop-animation');
const letterScreen = document.getElementById('letter-screen');
const typewriterText = document.getElementById('typewriter-text');

// --- VARIABLES DEL ÁRBOL Y PARTÍCULAS ---
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');
let animationProgress = 0;
const animationSpeed = 0.012;
let treeContainer = document.getElementById('tree-container');
let fallingHearts = [];

const colors = {
    wood: '#5D4037',
    hearts: ['#ff4d6d', '#ff758f', '#ff85a1', '#fbb1bd', '#ffb3c1']
};

// --- INTERACCIÓN ---
heartBtn.addEventListener('click', () => {
    introScreen.style.display = 'none';
    drop.classList.remove('hidden');
    drop.classList.add('drop-fall');

    setTimeout(() => {
        drop.classList.add('hidden');
        letterScreen.classList.remove('hidden');
        letterScreen.classList.add('active');
        
        initCanvasSize();
        animate(); // Inicia el bucle de animación principal
        startTypewriter();
        startTimer();
    }, 1400);
});

function initCanvasSize() {
    canvas.width = treeContainer.clientWidth;
    canvas.height = treeContainer.clientHeight;
}

// --- FUNCIÓN PARA DIBUJAR UN CORAZÓN ---
function drawHeart(x, y, size, color, angle = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    // Curvas para formar el corazón
    ctx.bezierCurveTo(-size / 2, -size / 2, -size, size / 3, 0, size);
    ctx.bezierCurveTo(size, size / 3, size / 2, -size / 2, 0, 0);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

// --- LÓGICA DEL ÁRBOL FRACTAL ---
function drawTree(startX, startY, len, angle, branchWidth, depth) {
    if (depth === 0) {
        // Al final de las ramas, dibujamos el corazón
        // Para que el conjunto parezca un corazón, ajustamos la probabilidad
        const color = colors.hearts[Math.floor(Math.random() * colors.hearts.length)];
        drawHeart(startX, startY, 8, color, Math.random() * 0.5);
        
        // Probabilidad de crear una partícula que cae
        if (animationProgress > 1.5 && Math.random() > 0.992) {
            fallingHearts.push(new HeartParticle(startX, startY, color));
        }
        return;
    }

    ctx.beginPath();
    ctx.strokeStyle = colors.wood;
    ctx.lineWidth = branchWidth;
    ctx.lineCap = 'round';
    ctx.moveTo(startX, startY);

    // Calculamos el final de la rama
    const endX = startX + Math.sin(angle * Math.PI / 180) * len * Math.min(1, animationProgress);
    const endY = startY - Math.cos(angle * Math.PI / 180) * len * Math.min(1, animationProgress);

    ctx.lineTo(endX, endY);
    ctx.stroke();

    if (animationProgress > 0.3) {
        // Reducimos la longitud y aumentamos el ángulo para que se abra en forma de copa redondeada
        drawTree(endX, endY, len * 0.75, angle - 25, branchWidth * 0.7, depth - 1);
        drawTree(endX, endY, len * 0.75, angle + 25, branchWidth * 0.7, depth - 1);
    }
}

// --- CLASE PARA CORAZONES QUE CAEN (VIENTO) ---
class HeartParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 5 + 3;
        this.speedY = Math.random() * 1 + 0.5;
        this.speedX = Math.random() * 1 - 0.5; // Viento inicial
        this.windAngle = Math.random() * Math.PI * 2;
        this.rotation = Math.random() * Math.PI;
    }

    update() {
        this.y += this.speedY;
        // Efecto de balanceo (viento)
        this.windAngle += 0.02;
        this.x += Math.sin(this.windAngle) * 0.5 + 0.2; // Sesgo hacia la derecha
        this.rotation += 0.01;
    }

    draw() {
        drawHeart(this.x, this.y, this.size, this.color, this.rotation);
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujamos el árbol (tronco centrado)
    // Profundidad 10 para crear una "copa" densa de corazones
    drawTree(canvas.width / 2, canvas.height - 30, 75, 0, 12, 10);

    // Manejamos las partículas que caen
    for (let i = fallingHearts.length - 1; i >= 0; i--) {
        fallingHearts[i].update();
        fallingHearts[i].draw();

        // Eliminar si salen de la pantalla
        if (fallingHearts[i].y > canvas.height) {
            fallingHearts.splice(i, 1);
        }
    }

    if (animationProgress < 2.0) {
        animationProgress += animationSpeed;
    }
    
    requestAnimationFrame(animate);
}

// --- RESTO DE FUNCIONES (Typewriter y Timer iguales) ---
function startTypewriter() {
    let msgIndex = 0;
    typewriterText.textContent = "";
    function typeNextMessage(){
        if (msgIndex >= messages.length) return;
        const currentMsg = messages[msgIndex];
        let charIndex = 0;
        function typeChar() {
            if (charIndex < currentMsg.length) {
                typewriterText.textContent += currentMsg.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 50);
            } else {
                typewriterText.textContent += "\n\n";
                msgIndex++;
                setTimeout(typeNextMessage, 1000);
            }
        }
        typeChar();
    }
    typeNextMessage();
}

function startTimer() {
    const timerElement = document.getElementById('timer');
    function update() {
        const now = new Date();
        const diff = now - startDate;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        timerElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    setInterval(update, 1000);
    update();
}

window.addEventListener('resize', initCanvasSize);