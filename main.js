let startGameButton = document.querySelector('.startButton');
let startContainer = document.querySelector('.startContainer');
let hpsContainer = document.querySelector('.hpsContainer');
let pointsContainer = document.querySelector('.pointsContainer');
let zombieContainer = document.querySelector('.zombieContainer');
let resultContainer = document.querySelector('.resultContainer');
let result = document.querySelector('.result');
let playAgain = document.querySelector('.endButton');

let score;
let lives;
let points;
let pointsString;
let end;
let shoot;
let lvl;
let lvlStep;

startGameButton.addEventListener('click', startGame);
playAgain.addEventListener('click', reGame);

function setVariables()
{
    score = 0;
    lives = 3;
    points = 33;
    pointsString;
    end = 1;
    shoot = 1;
    lvl = 0;
    lvlStep = 300;
}

function startGame() {
    setVariables();
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
    let zombieSize = getRandomZombieSize();
    zombie.classList.add("patient0");
    zombie.draggable = false;

    // Losowe położenie i prędkość zombie
    let xPos = window.innerWidth;
    let yPos = getRandomYPosition();
    let speed = getRandomSpeed();

    zombie.style.left = xPos + 'px';
    zombie.style.bottom = yPos + 'vh';
    zombie.style.zIndex = 999-yPos;

    zombie.width = zombieSize;
    zombie.height = zombieSize;
    zombieContainer.appendChild(zombie);
    zombie.draggable = false;

    // Animacja poruszania zombie
    animateZombie(zombie, xPos, speed);
}

function getRandomZombieSize() {
    return Math.floor(Math.random() * (500 - 200 + 1) + 200);
}

function getRandomYPosition() {
    return Math.floor(Math.random() * (20 - 2 + 1)+ 2); 
}

function getRandomSpeed() {
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
    let animationId;

    zombie.addEventListener('click', function () {
        if (points >= 0 && shoot == 1)
        {
            clicked = true;
            pnkts10();
            stopZombieAnimation();
            zombie.remove();
        }
    })

    function stopZombieAnimation() {
        cancelAnimationFrame(animationId); // Zatrzymuje animację tylko dla jednego, danego zombii
    }

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
    }

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
        pointsContainer.innerHTML = "-0000";
    }else{
        plusPnkts();
    }
    
}

function endGame() {
    zombieContainer.style.display = 'none';
    hpsContainer.style.display = 'none';
    pointsContainer.style.display = 'none';
    resultContainer.style.display = 'flex';
    resultContainer.style.flexDirection = 'column';

    let endScore1 = document.createElement('div');
    endScore1.textContent = "Game Over!";
    endScore1.style.fontSize = '5vw'; 
    result.appendChild(endScore1);

    let endScore2 = document.createElement('div');
    endScore2.textContent = "Score: " + points;
    endScore2.style.fontSize = '4vw';
    result.appendChild(endScore2);

    clearInterval(spawnInterval);
    cancelAnimationFrame(animateZombie);
    end = 0;
}

function reGame(){
    // Zaktualizuj kontener wyników
    clearResultContainer();
    // Usuń wszystkie zombie z ekranu
    removeAllZombies();

    setVariables();

    updateHearts();

    zombieContainer.style.display = 'flex';
    resultContainer.style.display = 'none';

    startGame();
}

function clearResultContainer() {
    while (result.firstChild) {
        result.removeChild(result.firstChild);
    }
}

function removeAllZombies() {
    // Pobierz wszystkie zombie na ekranie i usuń je
    let zombies = document.querySelectorAll('.patient0');
    zombies.forEach(zombie => zombie.remove());
}
