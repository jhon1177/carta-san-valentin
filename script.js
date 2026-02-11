const startDate = new Date('2025-02-14T00:00:00');
const messages = [
    "Si pudiera elegir un lugar seguro,\nsería a tu lado.",
    "Cuanto más tiempo estoy contigo\nmás te amo.",
    "Gracias por hacerme tan feliz.\nTe amo ♥️"
];

const introScreen = document.getElementById('intro-screen');
const heartBtn = document.getElementById('heart-btn');
const drop = document.getElementById('drop-animation');
const letterScreen = document.getElementById('letter-screen');
const trunk = document.getElementById('trunk');
const leavesContainer = document.getElementById('leaves-container');
const typewriterText = document.getElementById('typewriter-text');

heartBtn.addEventListener('click', () => {
    introScreen.style.display = 'none';
    drop.classList.remove('hidden');
    drop.classList.add('drop-fall');

    setTimeout(() => {
        drop.classList.add('hidden');
        letterScreen.classList.remove('hidden');
        startTreeAnimation();
        startTypewriter();
        startTimer();
    }, 1400);
});

function startTreeAnimation() {
    setTimeout(() => {
        trunk.classList.add('grown');
    }, 100);

    setTimeout(() => {
        createHeartLeaves();
    }, 2000);

    setTimeout(() => {
        startLeafFall();
    }, 3500);

}

function createHeartLeaves() {
    const leafCount = 500;

    for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElement('div');
        leaf.classList.add('leaf');
        leaf.textContent = '❤';

        const t = Math.random() * Math.PI * 10;

        let r = Math.sqrt(Math.random());

        const scale = 10 * r;

        const x = scale * (18 * Math.pow(Math.sin(t), 3));
        const y = -scale * (14 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));

        leaf.style.left = `${x}px`;
        leaf.style.top = `${y - 80}px`;

        const delay = Math.random() * 2;
        leaf.style.transitionDelay = `${delay}s`;

        const rotation = Math.random() * 360;
        leaf.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(0)`;

        leavesContainer.appendChild(leaf);

        requestAnimationFrame(() =>{
            setTimeout(() => {
                leaf.style.opacity = '1';
                leaf.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1)`;
            }, 50);
        });
    }
}

function startLeafFall() {
    const leaves = document.querySelectorAll('.leaf');

    setInterval(() => {
        const randomLeaf = leaves[Math.floor(Math.random() * leaves.length)];

        if (!randomLeaf) return;

        const fallingLeaf = randomLeaf.cloneNode(true);
        const rect = randomLeaf.getBoundingClientRect();
        const containerRect = leavesContainer.getBoundingClientRect();

        fallingLeaf.style.left = rect.left - containerRect.left + 'px';
        fallingLeaf.style.top = rect.top - containerRect.top + 'px';
        fallingLeaf.style.opacity = '1';
        fallingLeaf.style.transform = 'none';

        fallingLeaf.classList.add('falling');

        leavesContainer.appendChild(fallingLeaf);

        setTimeout(() => {
            fallingLeaf.remove();
        }, 3000);

    }, 400); // cada 400ms cae una hoja
}

function startTypewriter() {
    let fullText = "";
    let msgIndex = 0;

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

        timerElement.textContent = `${days} días ${hours} horas ${minutes} minutos ${seconds} segundos`;
    }

    setInterval(update, 1000);
    update();
}