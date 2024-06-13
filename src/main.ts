import { width, height } from "./constant";
import { gravity, initialVelocityY, velocity } from "./utility";

import { Player } from "./doodleCharacter";
import { background } from "./doodleCharacter";
import { Platform } from "./platform";
import { randInt, checkBoundary } from "./utility";
export let over = false;

let animationId: number;
let isPaused = false;
let platforms: Platform[] = [];
let doodler: Player;
let score = 0;
let highscore = localStorage.getItem("highscore")
  ? parseInt(localStorage.getItem("highscore")!)
  : 0;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = width;
canvas.height = height;
canvas.style.background = "black";

function addInitialPlatforms(): void {
  const firstPlatformX = (canvas.width - 60) / 2;
  const firstPlatformY = height - 20;
  const firstPlatform = new Platform(firstPlatformX, firstPlatformY, 15, 65);
  platforms.push(firstPlatform);

  for (let i = 0; i < 11; i++) {
    let x = randInt(0, canvas.width - 60);
    let y = i * 90;
    const platform = new Platform(x, y, 20, 70);
    platforms.push(platform);
  }
}

function addNewPlatform(): void {
  let randomX = Math.floor((Math.random() * width * 3) / 4);
  let newYPos =
    platforms.length > 0 ? Math.min(...platforms.map((p) => p.y)) - 70 : -25;
  let minSpacing = 70;
  newYPos = newYPos - minSpacing;
  let platform = new Platform(randomX, newYPos, 15, 70);

  platforms.push(platform);
}

function drawPlatforms(): void {
  platforms.forEach((platform: Platform, index) => {
    let isMovingDownward = velocity.y >= 0;
    let doodlerBottom = doodler.y + doodler.height;
    let doodlerLeft = doodler.x;
    let doodlerRight = doodler.x + doodler.width;

    const isWithinPlatform =
      doodlerRight > platform.x && doodlerLeft < platform.x + platform.width;

    const isTouchingTop =
      doodlerBottom >= platform.y && doodlerBottom <= platform.y + 10;

    if (isWithinPlatform && isTouchingTop && isMovingDownward) {
      velocity.y = initialVelocityY;
    }

    if (velocity.y < 0 && doodler.y < (height * 3) / 4) {
      platform.y -= initialVelocityY;
    }

    platform.drawImage(ctx);

    if (platform.y > height) {
      platforms.splice(index, 1);
      addNewPlatform();
      updateScore();
    }
  });
}

function update(): void {
  if (gameOver(doodler)) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (score > highscore) {
      highscore = score;
      localStorage.setItem("highscore", highscore.toString());
    }
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Game Over : Press Space to Restart", 10, height * (4 / 8));
    ctx.fillText(`Your score is ${score}`, 100, height * (5 / 8));
    ctx.fillText(`Your highest score is ${highscore}`, 80, height * (6 / 8));

    over = true;
    cancelAnimationFrame(animationId);
    return;
  }

  if (isPaused) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  doodler.drawImage(ctx);
  doodler.x += velocity.x;
  doodler.y += velocity.y;
  velocity.y += gravity;
  checkBoundary(doodler);
  drawPlatforms();
  displayScore();

  animationId = window.requestAnimationFrame(update);
}

function startGame(): void {
  if (!over) {
    animationId = window.requestAnimationFrame(update);
  }
}

function updateScore(): void {
  let points = 10;
  if (velocity.y < 0) {
    score += points;
  }
}

function displayScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 20, 20);
}

function reset(event: KeyboardEvent) {
  if (event.code === "Space" && over) {
    doodler = new Player();
    velocity.x = 0;
    velocity.y = -8;
    platforms.length = 0;
    score = -40;
    over = false;
    addInitialPlatforms();
    startGame();
  }
}

function gameOver(doodler: Player) {
  return doodler.y > height ? true : false;
}

function drawStartScreen() {
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(background, 0, 0, width, height);
  ctx.fillStyle = "red";
  ctx.font = "48px 'Comic Neue', sans-serif";
  ctx.fillText("doodle jump", width / 2 - 120, 100);

  ctx.fillStyle = "black";
  ctx.font = "36px 'Comic Neue', sans-serif";
  ctx.fillText("play", width / 2 - 30, 250);
  ctx.fillStyle = "green";
  ctx.font = "36px 'Comic Neue', sans-serif";
  ctx.fillText("press space to start", width / 2 - 140, 350);

  ctx.fillText("note: p - pause", width - 300, 450);
  ctx.fillText("note: r - resume", width - 300, 550);

  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.roundRect(width / 2 - 60, 210, 120, 50, 10);
  ctx.stroke();
}

function PauseGame(event: KeyboardEvent): void {
  if (event.key == "p") {
    isPaused = true;
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("paused", 10, height * (3 / 8));
    ctx.fillText("press r to resume", 10, height * (4 / 8));
    cancelAnimationFrame(animationId);
  }
  if (event.key == "r") {
    console.log("r is called");
    isPaused = false;
    animationId = window.requestAnimationFrame(update);
  }
}

// function that initiizes game
function startKey() {
  window.removeEventListener("keydown", startKey);
  startGame();
  window.addEventListener("keydown", reset);
}

window.onload = function () {
  doodler = new Player();
  if (ctx) {
    drawStartScreen();
    addInitialPlatforms();
    velocity.y = initialVelocityY;
    window.addEventListener("keydown", startKey);
    window.addEventListener("keydown", PauseGame);
    doodler.eventListener();
  }
};
