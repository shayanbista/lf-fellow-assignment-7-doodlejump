import { width, height } from "./constant";
import { detectCollision, gravity, initialVelocityY, velocity } from "./utility";
import { doodlerRightImage, doodler } from "./doodleCharacter";
import { doodlebackground } from "./doodleCharacter";
import { Platform } from "./platform";
import { randInt } from "./utility";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = width;
canvas.height = height;
canvas.style.background = "black";

const platforms: Platform[] = [];

function addPlatform() {
  for (let i = 0; i < 10; i++) {
    let x = randInt(0, canvas.width - 40);
    let y = i * 100;
    const platform = new Platform(x, y, 15, 35);
    platforms.push(platform);
  }
}

function drawPlatforms(): void {
  platforms.forEach((platform: Platform) => {

    // condition to check collision
    // if(detectCollision())
    platform.drawImage();
  });
}

function checkBoundary(doodler: {
  x: number;
  y?: number;
  height?: number;
  width?: number;
}) {
  if (doodler.x > canvas.width) {
    doodler.x = 0;
  } else if (doodler.x < 0) {
    doodler.x = canvas.width;
  }
}

function initialize() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(doodlebackground, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    doodlerRightImage,
    doodler.x,
    doodler.y,
    doodler.width,
    doodler.height
  );

  doodler.x += velocity.x;
  doodler.y += velocity.y;
  velocity.y += gravity;
  checkBoundary(doodler);
  drawPlatforms();

  window.requestAnimationFrame(initialize);
}

function moveDoodler(event: KeyboardEvent) {
  if (event.code == "ArrowRight" || event.code == "d") {
    velocity.x = 4;
    console.log("right");
    console.log("velocityx", velocity.x);
  }
  if (event.code == "ArrowLeft" || event.code == "a") {
    velocity.x -= 4;
    console.log("velcocityx", velocity.x);
  }
}

window.onload = function () {
  if (ctx) {
    window.requestAnimationFrame(initialize);

    addPlatform();
    velocity.y = initialVelocityY;
    console.log(velocity.y);

    document.addEventListener("keydown", moveDoodler);
  }
};
