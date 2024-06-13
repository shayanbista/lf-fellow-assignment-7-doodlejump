import { width, height } from "./constant";
import {
  gravity,
  initialVelocityY,
  velocity,
  gameOver,
  drawStartScreen,
} from "./utility";

import { Player } from "./doodleCharacter";
import { background } from "./doodleCharacter";
import { Platform } from "./platform";
import { randInt, checkBoundary } from "./utility";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = width;
canvas.height = height;
canvas.style.background = "black";

const platforms: Platform[] = [];
let doodler: Player;
let score = 0;
let highscore = localStorage.getItem("highscore")
  ? parseInt(localStorage.getItem("highscore")!)
  : 0;

let animationId: number;
export let over = false;

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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  doodler.drawImage(ctx);
  doodler.x += velocity.x;
  doodler.y += velocity.y;
  velocity.y += gravity;
  checkBoundary(doodler);
  drawPlatforms();

  displayScore();

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

window.onload = function () {
  doodler = new Player();
  if (ctx) {
    drawStartScreen(ctx);
    addInitialPlatforms();
    velocity.y = initialVelocityY;

    function startOnFirstKey() {
      window.removeEventListener("keydown", startOnFirstKey);
      startGame();
      window.addEventListener("keydown", reset);
    }

    window.addEventListener("keydown", startOnFirstKey);
    doodler.eventListener();
  }
};
