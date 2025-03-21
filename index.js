// Set canvas
let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 390;
canvas.height = 844;
document.body.appendChild(canvas);

// Game states
const GAME_STATE = {
    INTRO: 0,
    PLAYING: 1,
    GAMEOVER: 2
}
let currentGameState = GAME_STATE.INTRO;

// Load Img
let bgImg, catImg, catImg1, bulletImg, bulletLevelImg, gameOverImg, LevelUpImg, ripImg;
let introImg, startBtnImg, cloud1Img, cloud2Img, cloud3Img, bigBossImg, grassBgImg, sunImg, heartImg;
let bossX, bossY;
let bossAnimationOffset = 0;
let bossAnimationDirection = 1;
let grassX, grassY;
let grassAnimationOffset = 0;
let grassAnimationDirection = 1;
let catAniOffset = 0;
let catAniDirection = 1;
let attactImg;
let attactAniOffset = 0;
let attactDirection = 1;
let chatBoxImg;
let sunRotation = 0;
let enemyImages = [];
let gameOver = false; // If it is true, game will be over.
let score = 0;
let wasGameOver = false;

// 시작 버튼 표시 관련 변수
let showStartButton = false;
let startButtonTimer = 0;
let startButtonDelay = 80; // 약 1초 후 버튼 표시 (60프레임 기준)

// 구름 위치 및 애니메이션 관련 변수
let cloud1X = -40;  // 초기 위치 - 적절히 조정 필요
let cloud2X = canvas.width - 80; // 초기 위치 - 적절히 조정 필요
let cloud3X = 0; // 초기 위치 - 적절히 조정 필요
let cloud1Y = 370;  // Y 위치 - 적절히 조정 필요
let cloud2Y = 340; // Y 위치 - 적절히 조정 필요
let cloud3Y = 120;  // Y 위치 - 적절히 조정 필요

let cloudOffset = 0;
let cloudDirection = 1;
let cloudSpeed = 0.05; // 구름 움직임 속도


function loadImage() {
    // 기존 이미지 로드
    bgImg = new Image();
    bgImg.src = "images/background.png";

    catImg = new Image();
    catImg.src = "images/slime.png";

    catImg2 = new Image();
    catImg2.src = "images/hero-2.png";

    fireImg = new Image();
    fireImg.src = "images/bullet-1.gif";

    bulletImg = new Image();
    bulletImg.src = "images/bullet-3.png";

    bulletLevelImg = new Image();
    bulletLevelImg.src = "images/bulletcoin.png";

    gameOverImg = new Image();
    gameOverImg.src = "images/game-over.png";

    ripImg = new Image();
    ripImg.src = "images/rip.png";

    heartImg = new Image();
    heartImg.src = "images/heart.png";

    LevelUpImg = new Image();
    LevelUpImg.src = "images/levelup.png";

    chatBoxImg = new Image();
    chatBoxImg.src = "images/chatbox.png";

    // 인트로 화면용 이미지 로드
    introImg = new Image();
    introImg.src = "images/intro.png";

    grassBgImg = new Image();
    grassBgImg.src = "images/grass-bg.png";


    bigBossImg = new Image();
    bigBossImg.src = "images/boss.png";


    startBtnImg = new Image();
    startBtnImg.src = "images/start-game.png";

    cloud1Img = new Image();
    cloud1Img.src = "images/cloud-1.png";

    cloud2Img = new Image();
    cloud2Img.src = "images/cloud-2.png";

    cloud3Img = new Image();
    cloud3Img.src = "images/cloud-3.png";

    sunImg = new Image();
    sunImg.src = "images/sun.png";

    attactImg = new Image();
    attactImg.src = "images/attact.png";



    // 몬스터 이미지 로드
    for (let i = 1; i <= 5; i++) {
        let Mosterimg = new Image();
        Mosterimg.src = `images/monster-${i}.png`; // 예: images/monster-1.png ~ images/monster-5.png
        enemyImages.push(Mosterimg);
    }

}

// update Intro Images
function updateGrass() {
    // 제자리에서 상하로 조금씩 움직임
    grassAnimationOffset += 0.05 * grassAnimationDirection;

    // 움직임 범위 제한 (-5 ~ 5픽셀)
    if (grassAnimationOffset > 5) {
        grassAnimationDirection = -1;
    } else if (grassAnimationOffset < -5) {
        grassAnimationDirection = 1;
    }
}



function updateBoss() {
    // 제자리에서 상하로 조금씩 움직임
    bossAnimationOffset += 0.08 * bossAnimationDirection;

    // 움직임 범위 제한 (-5 ~ 5픽셀)
    if (bossAnimationOffset > 5) {
        bossAnimationDirection = -1;
    } else if (bossAnimationOffset < -5) {
        bossAnimationDirection = 1;
    }
}


function updateIntroCat() {
    // 제자리에서 상하로 조금씩 움직임
    catAniOffset += 0.5 * catAniDirection;

    // 움직임 범위 제한 (-5 ~ 5픽셀)
    if (catAniOffset > 10) {
        catAniDirection = -1;
    } else if (catAniOffset < -10) {
        catAniDirection = 1;
    }
}


// Title Animation
let titleTextLine1 = "CATS SAVE";
let titleTextLine2 = "THE WORLD";
let currentTitleLine1Index = 0;
let currentTitleLine2Index = 0;
let titleTimer = 0;
let titleDisplayInterval = 6; // 프레임 간격 (숫자가 커질수록 더 느리게 나타남)
let line1Complete = false; // 첫 번째 줄 완료 여부
let pauseBeforeLine2 = 30; // 첫 번째 줄과 두 번째 줄 사이 일시 정지 프레임 수
let pauseCounter = 0;

// Title update
function updateTitle() {
    // timer ++
    titleTimer++;

    if (!line1Complete) {
        // 첫 번째 줄 처리
        if (titleTimer >= titleDisplayInterval && currentTitleLine1Index < titleTextLine1.length) {
            currentTitleLine1Index++;
            titleTimer = 0;

            // 첫 번째 줄이 완료되면 플래그 설정
            if (currentTitleLine1Index === titleTextLine1.length) {
                line1Complete = true;
            }
        }
    } else if (pauseCounter < pauseBeforeLine2) {
        // 일시 정지 시간 처리
        pauseCounter++;
    } else {
        // 두 번째 줄 처리
        if (titleTimer >= titleDisplayInterval && currentTitleLine2Index < titleTextLine2.length) {
            currentTitleLine2Index++;
            titleTimer = 0;
        }
    }
}

//Title Animation2
let titTextLine1 = "A game that cats save the world.";
let titTextLine2 = "Every cats are precious";
let currentTitLine1Idx = 0;
let currentTitLine2Idx = 0;
let titTimer = 0;
let titDisplayInterval = 5;
let line1Complt = false;
let pauseBefore2 = 30;
let pauseCount = 0;

// Title2 update 
function updateTitle2() {
    //timer ++
    titTimer++;

    if (!line1Complt) {
        if (titTimer >= titDisplayInterval && currentTitLine1Idx < titTextLine1.length) {
            currentTitLine1Idx++;
            titTimer = 0;

            if (currentTitLine1Idx === titTextLine1.length) {
                line1Complt = true;
            }
        }
    } else if (pauseCount < pauseBefore2) {
        pauseCount++;
    } else {
        if (titTimer >= titDisplayInterval && currentTitLine2Idx < titTextLine2.length) {
            currentTitLine2Idx++;
            titTimer = 0;
        }
    }
}


// sun
function updateRotatingSun() {
    // 회전 각도 증가 (천천히 회전하도록 작은 값 사용)
    sunRotation += 0.01;

    // 2π 이상이면 0으로 초기화 (선택사항)
    if (sunRotation >= Math.PI * 2) {
        sunRotation = 0;
    }
}


let showAttactImg = false;
let attactImgTimer = 0;
let attactImgInterval = 90; // 약 1.5초마다 토글 (60프레임 기준)

// updateAttact 함수 수정
function updateAttact() {
    // 이미지 애니메이션 업데이트
    attactAniOffset += 1 * attactDirection;

    // 움직임 범위 제한 (-5 ~ 5픽셀)
    if (attactAniOffset > 8) {
        attactDirection = -1;
    } else if (attactAniOffset < -10) {
        attactDirection = 1;
    }

    // 타이머 증가
    attactImgTimer++;

    // 일정 간격으로 이미지 표시 상태 토글
    if (attactImgTimer >= attactImgInterval) {
        showAttactImg = !showAttactImg; // 상태 전환
        attactImgTimer = 0; // 타이머 리셋
    }
}


//Intro Rendering
function renderIntro() {

    // grass init location
    grassX = 0;
    grassY = canvas.height - 140;

    // boss init location
    bossX = canvas.width - 200;
    bossY = canvas.height - 300;

    ctx.drawImage(introImg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(grassBgImg, grassX, grassY + grassAnimationOffset, canvas.width, 150)
    ctx.drawImage(bigBossImg, bossX, bossY + bossAnimationOffset, 200, 200);
    ctx.drawImage(catImg2, 80 + catAniOffset, canvas.height - 170 + catAniOffset)
    // 조건부로 attactImg 렌더링
    if (showAttactImg) {
        ctx.drawImage(attactImg, 130 + catAniOffset, canvas.height - 205 + catAniOffset);
    }

    // 구름 렌더링
    ctx.drawImage(cloud1Img, cloud1X + cloudOffset, cloud1Y, 100, 60); // 크기는 조정 필요
    ctx.drawImage(cloud2Img, cloud2X + cloudOffset, cloud2Y, 100, 40); // 크기는 조정 필요
    ctx.drawImage(cloud3Img, cloud3X + cloudOffset, cloud3Y, 90, 50);

    // 타이틀 텍스트 그리기
    ctx.font = 'bold 50px Minecraft';
    ctx.fillStyle = "#FFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // 첫 번째 줄 그리기
    const displayedTextLine1 = titleTextLine1.substring(0, currentTitleLine1Index);
    // ctx.strokeText(displayedTextLine1, canvas.width / 2, 150); // Y 위치를 조정
    ctx.fillText(displayedTextLine1, canvas.width / 2, 250);

    // 두 번째 줄 그리기 (첫 번째 줄이 완료되고 일시 정지가 끝난 후)
    if (line1Complete && pauseCounter >= pauseBeforeLine2) {
        const displayedTextLine2 = titleTextLine2.substring(0, currentTitleLine2Index);
        // ctx.strokeText(displayedTextLine2, canvas.width / 2, 130); // 두 번째 줄을 첫 번째 줄 아래에 위치
        ctx.fillText(displayedTextLine2, canvas.width / 2, 310);
    }



    // title2 draw
    ctx.font = '13px Minecraft';
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const displayedTxtLine1 = titTextLine1.substring(0, currentTitLine1Idx);
    ctx.fillText(displayedTxtLine1, canvas.width / 2, 360)

    if (line1Complt && pauseCount >= pauseBefore2) {
        const displayedTxtLine2 = titTextLine2.substring(0, currentTitLine2Idx);
        ctx.fillText(displayedTxtLine2, canvas.width / 2, 380);
    }

    // 회전하는 태양 그리기
    const sunX = canvas.width - 100;
    const sunY = 100;
    const sunSize = 80;

    // 현재 캔버스 상태 저장
    ctx.save();

    // 회전 중심점으로 캔버스 원점 이동
    ctx.translate(sunX + sunSize / 2, sunY + sunSize / 2);

    // 캔버스 회전
    ctx.rotate(sunRotation);

    // 이미지 그리기 (중심점을 원점으로 이동했으므로 위치 조정)
    ctx.drawImage(sunImg, -sunSize / 2, -sunSize / 2, sunSize, sunSize);

    // 캔버스 상태 복원
    ctx.restore();

    // start btn
    if (showStartButton) {
        const btnWidth = 200;
        const btnHeight = 38;
        const btnX = (canvas.width - btnWidth) / 2;
        const btnY = (canvas.height - btnHeight) / 2;

        ctx.drawImage(startBtnImg, btnX, btnY, btnWidth, btnHeight);
    }
}




// 게임 상태 전환 함수
function changeGameState(newState) {
    currentGameState = newState;


    if (newState === GAME_STATE.INTRO) {
        showStartButton = false;
        startButtonTimer = 0;
    }

    // 게임오버에서 인트로로 전환 시 wasGameOver 플래그 설정
    if (newState === GAME_STATE.INTRO && currentGameState === GAME_STATE.GAMEOVER) {
        wasGameOver = true;
    }
}



// Mouse Event Handler
function setupMouseListener() {
    canvas.addEventListener("click", function (event) {
        // Only work in Intro
        if (currentGameState === GAME_STATE.INTRO) {
            // Mouse Coordinate
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            // calculate in intro
            const btnWidth = 200;
            const btnHeight = 38;
            const btnX = (canvas.width - btnWidth) / 2;
            const btnY = (canvas.height - btnHeight) / 2;

            // check for cliking btn
            if (mouseX >= btnX && mouseX <= btnX + btnWidth &&
                mouseY >= btnY && mouseY <= btnY + btnHeight) {
                // start Game
                currentGameState = GAME_STATE.PLAYING;
                resetGame();
            }
        }
    });
}


// 튜토리얼 관련 변수
let tutorialActive = false;
let tutorialStep = 0;
let tutorialComplete = false;

const tutorialMessages = [
    "Hello! I'm a hero cat saving the world!",
    "You can move with the arrow keys ←↑→↓",
    "and shoot with the spacebar!",
    "Hit the monsters to earn points!",
    "If you collide with a monster or ",
    "a monster reaches the ground,",
    "You lose a life!",
    "Level up to reveal your true form!",
    "If you're ready, press enter key to start!"
];


// Add these variables near the top where other game variables are defined
let lives = 4; // Start with 3 lives
let invincibilityFrames = 0; // To prevent multiple hits at once
const INVINCIBILITY_DURATION = 60; // About 1 second of invincibility after being hit

// 말풍선 애니메이션 변수 추가
let chatBoxAnimationOffset = 0;
let chatBoxAnimationDirection = 1;


function updateChatBox() {
    // 제자리에서 상하로 조금씩 움직임
    chatBoxAnimationOffset += 0.3 * chatBoxAnimationDirection;

    // 움직임 범위 제한 (-3 ~ 3픽셀)
    if (chatBoxAnimationOffset > 3) {
        chatBoxAnimationDirection = -1;
    } else if (chatBoxAnimationOffset < -3) {
        chatBoxAnimationDirection = 1;
    }
}

// 게임 리셋 함수
function resetGame() {
    // 게임 상태 초기화
    gameOver = false;
    score = 0;
    // wasGameOver = false; // 게임 시작 시 게임오버 플래그 초기화

    // Reset lives
    lives = 4;
    invincibilityFrames = 0;


    // 게임 요소 초기화
    bulletList = [];
    enemyList = [];
    fireEffects = [];

    // 캐릭터 위치 초기화
    catImgX = canvas.width / 2 - 30;
    catImgY = canvas.height - 60;

    // 고양이 레벨 초기화
    catLevel = 1;
    showLevelUpEffect = false;
    levelUpTimer = 0;

    // 튜토리얼 활성화
    if (wasGameOver) {
        tutorialActive = false;
        tutorialComplete = true;
        createEnemy(); // 바로 적 생성 시작
    } else {
        // 첫 시작인 경우 튜토리얼 활성화
        tutorialActive = true;
        tutorialStep = 0;
        tutorialComplete = false;
    }

    // 적 생성은 튜토리얼 후에 시작
    if (!tutorialActive) {
        createEnemy();
    }
}

// cat cooordinate
let catImgX = canvas.width / 2 - 30;
let catImgY = canvas.height - 60;




// 고양이 레벨업 관련 변수
let catLevel = 1; // 시작 레벨
let showLevelUpEffect = false; // 레벨업 효과 표시 여부
let levelUpTimer = 0; // 레벨업 효과 타이머
const LEVEL_UP_DURATION = 120; // 약 2초간 효과 표시

function checkLevelUp() {
    // 점수가 20점 이상이고 아직 레벨업하지 않았다면
    if (score >= 10 && catLevel === 1) {
        catLevel = 2; // 레벨 증가
        showLevelUpEffect = true; // 레벨업 효과 표시
        levelUpTimer = LEVEL_UP_DURATION; // 타이머 설정
    }
}

function updateLevelUpEffect() {
    if (showLevelUpEffect) {
        levelUpTimer--;
        if (levelUpTimer <= 0) {
            showLevelUpEffect = false;
        }
    }
}


// making bullet
let bulletList = [];//A list of bullet storage

function bullet() {
    this.x = 0;
    this.y = 0;
    this.init = function () {
        this.x = catImgX;
        this.y = catImgY - 30;
        this.alive = true;
        bulletList.push(this);
    }

    this.update = function () {
        // 레벨에 따라 총알 속도 조정
        const bulletSpeed = catLevel === 1 ? 4 : 6;
        this.y -= bulletSpeed;

        if (this.y < 0) {
            this.alive = false;  // 해당 bullet을 죽음 처리
        }
    }

    this.checkHit = function () {
        for (let i = 0; i < enemyList.length; i++) {
            if (this.y <= enemyList[i].y && this.x >= enemyList[i].x + 10 && this.x <= enemyList[i].x + 65) {
                // 레벨에 따라 점수 차등 지급
                score += catLevel;
                this.alive = false;

                // 🔥 
                fireEffects.push({
                    x: enemyList[i].x,
                    y: enemyList[i].y,
                    duration: 8 // 불꽃이 유지될 프레임 수
                });

                enemyList.splice(i, 1);
                break;
            }
        }
    }
}

// fire Effect
let fireEffects = [];
function updateFireEffects() {
    for (let i = fireEffects.length - 1; i >= 0; i--) {
        fireEffects[i].duration--;
        if (fireEffects[i].duration <= 0) {
            fireEffects.splice(i, 1);
        }
    }
}


// Add this function to check for collisions between cat and enemies
function checkCatEnemyCollision() {
    // Only check if not currently invincible
    if (invincibilityFrames <= 0) {
        for (let i = 0; i < enemyList.length; i++) {
            // Simple collision detection (you might want to improve this)
            if (
                catImgX < enemyList[i].x + 65 &&
                catImgX + 60 > enemyList[i].x &&
                catImgY < enemyList[i].y + 65 &&
                catImgY + 65 > enemyList[i].y
            ) {
                // Handle collision
                lives--;
                invincibilityFrames = INVINCIBILITY_DURATION;

                // Create fire effect at collision point
                fireEffects.push({
                    x: enemyList[i].x,
                    y: enemyList[i].y,
                    duration: 8
                });

                // Remove the enemy
                enemyList.splice(i, 1);

                // Check if game over
                if (lives < 0) {
                    gameOver = true;
                    currentGameState = GAME_STATE.GAMEOVER;
                    // console.log("gameover - no lives left");

                    // 2 seconds before returning to intro
                    setTimeout(() => {
                        currentGameState = GAME_STATE.INTRO;
                        wasGameOver = true;
                    }, 2000);
                }

                break;
            }
        }
    } else {
        // Reduce invincibility frames
        invincibilityFrames--;
    }
}


// making Enemy
let enemyList = [];

function generateRandomValue(min, max) {
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNum;
}
function enemy() {
    this.x = 0;
    this.y = 0;
    this.image = enemyImages[generateRandomValue(0, 4)];
    this.init = function () {
        this.x = generateRandomValue(0, canvas.width - 75);
        this.y = 0;

        enemyList.push(this);
    }
    this.update = function () {
        this.y += 2;

        if (this.y >= canvas.height - 75) {
            // 적이 바닥에 도달하면 생명력 감소
            lives--;

            // 이 적 제거
            const index = enemyList.indexOf(this);
            if (index > -1) {
                enemyList.splice(index, 1);
            }

            // 생명력이 0이 되면 게임 오버
            if (lives <= 0) {
                gameOver = true;
                currentGameState = GAME_STATE.GAMEOVER;
                // console.log("gameover - no lives left");

                // 2초 후 인트로 화면으로 전환
                setTimeout(() => {
                    currentGameState = GAME_STATE.INTRO;
                    wasGameOver = true;
                }, 2000);
            }
        }
    }
}

// setup keyboard
let keysDown = {};
function setupKeyboardListener() {
    document.addEventListener("keydown", (event) => {
        keysDown[event.keyCode] = true;
        // console.log('Click', keysDown);

        // 튜토리얼 중 키 입력 시 다음 단계로
        if (event.keyCode == 13) {
            if (tutorialActive) {
                tutorialStep++;
                if (tutorialStep >= tutorialMessages.length) {
                    tutorialActive = false;
                    tutorialComplete = true;
                    createEnemy(); // 튜토리얼 완료 후 적 생성 시작
                }
                return; // 튜토리얼 중에는 다른 키 입력 무시
            }
        }
    });
    document.addEventListener("keyup", (event) => {
        delete keysDown[event.keyCode];
        // console.log('After Click', keysDown);

        if (event.keyCode == 32) {
            if (currentGameState === GAME_STATE.PLAYING) {
                createBullet(); // 총알 생성
            } else if (currentGameState === GAME_STATE.GAMEOVER) {
                // 게임 오버 상태에서 스페이스바 누르면 인트로로 돌아가기
                currentGameState = GAME_STATE.INTRO;
                wasGameOver = true; // 게임오버에서 인트로로 전환된 상태임을 표시
            }
        }
    });
}

// create bullet
function createBullet() {
    // console.log('complete creating bullet');
    let newBullet = new bullet();
    newBullet.init();
    // console.log("new bullet list", bulletList)
}

// 적 생성 타이머 변수
let enemyGeneratorTimer = null;

// create Enemy
function createEnemy() {
    // 이미 타이머가 있다면 제거
    if (enemyGeneratorTimer !== null) {
        clearInterval(enemyGeneratorTimer);
    }

    // 새 타이머 설정
    enemyGeneratorTimer = setInterval(function () {
        if (currentGameState === GAME_STATE.PLAYING) {
            let enemyCount = generateRandomValue(1, 3);
            for (let i = 0; i < enemyCount; i++) {
                let newEnemy = new enemy();
                newEnemy.init();
            }
        }
    }, 1000);
}

//Arrow Key Movement
function update() {
    // intro
    if (currentGameState === GAME_STATE.INTRO) {
        updateGrass();
        updateBoss();
        updateIntroCat();
        updateTitle();
        updateTitle2()
        updateRotatingSun();
        updateAttact();

        // 시작 버튼 타이머 업데이트
        startButtonTimer++;
        if (startButtonTimer >= startButtonDelay) {
            showStartButton = true;
        }

        // 구름 애니메이션 업데이트
        cloudOffset += cloudSpeed * cloudDirection;
        if (cloudOffset > 10) {
            cloudDirection = -1;
        } else if (cloudOffset < 0) {
            cloudDirection = 1;
        }
        return;
    }
    if (currentGameState === GAME_STATE.PLAYING) {

        checkLevelUp();
        updateLevelUpEffect();
    }
    // gameover
    if (currentGameState === GAME_STATE.GAMEOVER) {
        return;
    }

    // 게임 플레이 중인 경우 모든 요소 업데이트
    if (39 in keysDown) {
        catImgX += 5;
    }
    if (37 in keysDown) {
        catImgX -= 5;
    }
    if (38 in keysDown) {
        catImgY -= 5;
    }
    if (40 in keysDown) {
        catImgY += 5;
    }

    if (catImgX <= 0) {
        catImgX = 0;
    }

    if (catImgX + 60 >= canvas.width) {
        catImgX = canvas.width - 60;
    }

    if (catImgY + 65 >= canvas.height) {
        catImgY = canvas.height - 65;
    }
    if (catImgY <= 0) {
        catImgY = 0;
    }

    // 고양이와 적 충돌 확인 추가
    checkCatEnemyCollision();

    // Call a function that updates the y-coordinate of the bullet
    for (let i = 0; i < bulletList.length; i++) {
        if (bulletList[i].alive) {
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }
    for (let i = 0; i < enemyList.length; i++) {
        enemyList[i].update();
    }

    updateFireEffects();

    // 튜토리얼 중이면 업데이트 중단
    if (tutorialActive) {
        updateChatBox();
        return;
    }
}

// render
function render() {
    // 게임 상태에 따라 다른 화면 렌더링
    if (currentGameState === GAME_STATE.INTRO) {
        renderIntro();
    } else if (currentGameState === GAME_STATE.PLAYING) {
        // 게임 플레이 화면 렌더링
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

        ctx.font = '15px Minecraft';
        ctx.fillStyle = "#000";
        ctx.fillText(`Score: ${score}`, 30, 40);

        // 현재 고양이 레벨에 따라 다른 이미지 표시
        let currentCatImg = catLevel === 1 ? catImg : catImg2;

        // 무적 상태일 때 깜박이는 효과로 고양이 그리기
        if (invincibilityFrames <= 0 || Math.floor(invincibilityFrames / 5) % 2 === 0) {
            ctx.drawImage(currentCatImg, catImgX, catImgY);
        }

        // 레벨업 효과 표시
        if (showLevelUpEffect) {
            // LevelUpImg 표시 (고양이 옆에)
            ctx.drawImage(LevelUpImg, catImgX + 60, catImgY - 30, 80, 60);
        }

        // 오른쪽 상단에 생명력 표시 추가
        for (let i = 0; i < Math.min(lives, 3); i++) {
            ctx.drawImage(heartImg, canvas.width - 40 - (i * 35), 25, 30, 30);
        }

        for (let i = 0; i < bulletList.length; i++) {
            if (bulletList[i].alive) {
                // 레벨에 따라 다른 총알 이미지 사용
                let currentBulletImg = catLevel === 1 ? bulletImg : bulletLevelImg;
                ctx.drawImage(currentBulletImg, bulletList[i].x, bulletList[i].y);
            }
        }


        for (let i = 0; i < enemyList.length; i++) {
            ctx.drawImage(enemyList[i].image, enemyList[i].x, enemyList[i].y);
        }

        for (let i = 0; i < fireEffects.length; i++) {
            ctx.drawImage(fireImg, fireEffects[i].x, fireEffects[i].y);
        }

        // 튜토리얼 말풍선 렌더링
        if (tutorialActive) {
            // 말풍선 위치 (고양이 위) - 애니메이션 오프셋 적용
            const chatBoxX = catImgX - 70;
            const chatBoxY = catImgY - 120 + chatBoxAnimationOffset; // 애니메이션 오프셋 추가
            const chatBoxWidth = 200;
            const chatBoxHeight = 100;

            // 말풍선 이미지 그리기
            ctx.drawImage(chatBoxImg, chatBoxX, chatBoxY, chatBoxWidth, chatBoxHeight);

            // 텍스트 그리기
            ctx.font = '15px Minecraft';
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";

            // 텍스트 줄바꿈 처리
            const message = tutorialMessages[tutorialStep];
            const maxWidth = chatBoxWidth - 30;
            const lineHeight = 18;
            let words = message.split(' ');
            let line = '';
            let y = chatBoxY + 35;

            for (let i = 0; i < words.length; i++) {
                let testLine = line + words[i] + ' ';
                let metrics = ctx.measureText(testLine);
                let testWidth = metrics.width;

                if (testWidth > maxWidth && i > 0) {
                    ctx.fillText(line, chatBoxX + chatBoxWidth / 2, y);
                    line = words[i] + ' ';
                    y += lineHeight;
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line, chatBoxX + chatBoxWidth / 2, y);

            // 다음으로 넘어가는 방법 안내
            ctx.font = '12px Minecraft';
            ctx.fillStyle = "#666";
            ctx.fillText("press enter", chatBoxX + chatBoxWidth / 2, chatBoxY + chatBoxHeight - 30);

            // 텍스트 정렬 원래대로
            ctx.textAlign = "left";
        }
    } else if (currentGameState === GAME_STATE.GAMEOVER) {
        // 게임 오버 화면 렌더링
        ctx.drawImage(ripImg, canvas.width / 2 - 100, canvas.height / 2 - 100);
    }
}

// Load function
function main() {
    update();
    render();
    requestAnimationFrame(main);
}

loadImage();
setupKeyboardListener();
setupMouseListener();
main();