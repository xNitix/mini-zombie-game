let startGameButton = document.querySelector('.startButton');
let startContainer = document.querySelector('.startContainer');
let hpsContainer = document.querySelector('.hpsContainer');
let pointsContainer = document.querySelector('.pointsContainer');
let zombieContainer = document.querySelector('.zombieContainer');
let resultContainer = document.querySelector('.resultContainer');

let score = 0;
let lives = 3;
let points = 33;
let pointsString;
let end = 1;
let shoot = 1;
let lvl = 0;
let lvlStep = 300;

startGameButton.addEventListener('click', startGame);

function startGame() {
    startContainer.style.display = 'none';
    hpsContainer.style.display = 'flex';
    pointsContainer.style.display = 'flex';
    document.addEventListener('click',minusPnkt);
    plusPnkts();

    // Rozpocznij grę
    spawnInterval = setInterval(spawnZombie,800 - 40*lvl);  
}

function spawnZombie() {
    if (lives <= 0) {
        endGame();
        return;
    }

    let zombie = new Image();
    let zombieSize = getRandomZombieSize(); // Funkcja do losowania rozmiaru zombie
    zombie.classList.add("patient0");
    zombie.draggable = false;

    // Losowe położenie i prędkość zombie
    let xPos = window.innerWidth;
    let yPos = getRandomYPosition();
    let speed = getRandomSpeed();

    zombie.style.left = xPos + 'px';
    zombie.style.marginTop = (100-zombieSize/10-yPos) + 'vh';
    zombie.width = zombieSize;
    zombie.height = zombieSize;
    zombieContainer.appendChild(zombie);
    zombie.draggable = false;

    // Animacja poruszania zombie
    animateZombie(zombie, xPos, speed);
}

function getRandomZombieSize() {
    // Losowa szerokość i wysokość dla zombiaka (np. od 50 do 150 pikseli)
    return Math.floor(Math.random() * (600 - 100 + 1) + 100);
}

function getRandomYPosition() {
    // Losowa wysokość od 0 do wysokości okna przeglądarki
    return Math.floor(Math.random() * (20 - 2 + 1)+ 2); 
}

function getRandomSpeed() {
    // Losowa prędkość od minSpeed do maxSpeed
    if(points > lvlStep)
    {
        lvl += 1;
        lvlStep += 300;
    }
    return Math.random() * ((4+lvl) - 1) + 1;
}

function animateZombie(zombie, xPos, speed) {
    // Animacja poruszania zombie w lewo
    let indx = 9;
    let frameMove = 10;

    zombie.addEventListener('click', function () {
        if (points >= 0 && shoot == 1)
        {
            clicked = true;
            pnkts10();
            stopZombieAnimation();// Zatrzymanie animacji tylko dla tego zombiaka
            zombie.remove();
        }
    })

    // Funkcja do zatrzymania animacji zombiaka
    function stopZombieAnimation() {
        cancelAnimationFrame(animationId); // Zatrzymuje animację tylko dla tego zombiaka
    }

    let animationId;

    const frame = () => {
        if(end == 1){   
            if (xPos + zombie.width < 0) {
                zombie.remove();
                loseLife();
                return;
            }
    
            xPos -= speed;
            zombie.style.left = xPos + 'px';
            zombie.src = "jpg/zombies/walkingdead" + indx + ".png"
            frameMove --;
            if(frameMove == 0)
            {
                indx--;
                frameMove=10;
            }
            if(indx <= 0)
            {
                indx = 9;
            }
    
            animationId = requestAnimationFrame(frame);

        }
    };

    frame();
}

function loseLife() {
    lives--;
    updateHearts();

    if (lives <= 0) {
        endGame();
    }
}

function updateHearts() {
    // Aktualizacja ilości serc (hearts) na ekranie
    let hearts = document.querySelectorAll('.heart_ic');

    for (let i = 0; i < hearts.length; i++) {
        if (i < lives) {
            hearts[i].src = "jpg/full_heart.png";
        } else {
            hearts[i].src = "jpg/empty_heart.png";
        }
    }
}

function pnkts10()
{
    points += 13;
    plusPnkts();
}

function plusPnkts() {
    let stringPoints = points.toString()
    pointsContainer.innerHTML = stringPoints.padStart(5, '0');
}

function minusPnkt()
{

    points -= 3;
    if(points < 0){
        shoot = 0;
        points = 0;
        let stringPoints = points.toString()
        pointsContainer.innerHTML = stringPoints.padStart(5, '0');
    }else{
        plusPnkts();
    }
    
}

function endGame() {
    // Koniec gry - wyświetlenie wyniku
    zombieContainer.style.display = 'none';
    hpsContainer.style.display = 'none';
    pointsContainer.style.display = 'none';
    resultContainer.style.display = 'flex';
    let result = document.createElement('div');
    result.textContent = "Koniec gry. Twój wynik: " + points;
    resultContainer.appendChild(result);
    clearInterval(spawnInterval);
    cancelAnimationFrame(animateZombie);
    end = 0;
}