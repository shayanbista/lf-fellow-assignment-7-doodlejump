import { width, height } from "./constant";
import {
  detectCollision,
  gravity,
  initialVelocityY,
  velocity,
  gameOver,
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
export let over = false;

function addInitialPlatforms() {
  const firstPlatformX = (canvas.width - 60) / 2;
  const firstPlatformY = height - 20;
  const firstPlatform = new Platform(firstPlatformX, firstPlatformY, 15, 65);
  platforms.push(firstPlatform);

  for (let i = 0; i < 11; i++) {
    let x = randInt(0, canvas.width - 60);
    let y = i * 90;
    const platform = new Platform(x, y, 20, 55);
    platforms.push(platform);
  }
}

function addNewPlatform(): void {
  let randomX = Math.floor((Math.random() * width * 3) / 4);
  let newYPos =
    platforms.length > 0 ? Math.min(...platforms.map((p) => p.y)) - 70 : -25;
  let minSpacing = 70;
  newYPos = newYPos - minSpacing;
  let platform = new Platform(randomX, newYPos, 15, 55);

  platforms.push(platform);
}

function drawPlatforms(): void {
  platforms.forEach((platform: Platform, index) => {
    if (detectCollision(doodler, platform) && velocity.y >= 0) {
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

function initialize() {
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
    ctx.fillStyle = "game over press space to restart";
    ctx.fillText("Game Over :press space to restart", 10, height * (7 / 8));
    over = true;
  }

  window.requestAnimationFrame(initialize);
}

function startGame(): void {
  initialize();
}

function updateScore() {
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
    console.log("score", score);
    displayScore();

    addInitialPlatforms();
  }
}

window.onload = function () {
  doodler = new Player();
  if (ctx) {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.font = "15px Arial";
    ctx.fillText("press any key to start the game", 100, 150);

    console.log(doodler);

    addInitialPlatforms();
    velocity.y = initialVelocityY;
    window.addEventListener("keydown", reset);

    doodler.eventListener();
  }
};

window.addEventListener("keydown", startGame);
