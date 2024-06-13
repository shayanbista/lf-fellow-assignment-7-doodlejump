import { Platform } from "./platform";
import { width, height } from "./constant";
import { Player, background } from "./doodleCharacter";

// variable part
export let initialVelocityY: number = -8;
export let gravity: number = 0.4;
export let jumps = 0;
export let velocity = {
  x: 0,
  y: 0,
};

// functions part
export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// AABB collision
export function detectCollision(
  player: { x: number; width: number; y: number; height: number },
  platform: Platform
): boolean {
  return (
    player.x < platform.x + platform.width &&
    player.x + player.width > platform.x &&
    player.y < platform.y + platform.height &&
    player.y + player.height > platform.y
  );
}

export function checkBoundary(doodler: {
  x: number;
  y?: number;
  height?: number;
  width?: number;
}) {
  if (doodler.x > width) {
    doodler.x = 0;
  } else if (doodler.x < 0) {
    doodler.x = width;
  }
}

export function gameOver(doodler: Player) {
  return doodler.y > height ? true : false;
}

export function drawStartScreen(ctx: CanvasRenderingContext2D) {
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

  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.roundRect(width / 2 - 60, 210, 120, 50, 10);
  ctx.stroke();
}
