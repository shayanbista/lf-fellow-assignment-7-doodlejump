import { height, width } from "./constant";
import { randInt } from "./utility";

export function newPlatform() {
  let x = Math.floor(randInt(0, width - 50));
  let y = -height;
  const platform = new Platform(x, y, 15, 55);
  return platform;
}

interface Iplatform {
  x: number;
  y: number;
  height: number;
  width: number;
  img: HTMLImageElement;
  moveTile: boolean;
}

export class Platform implements Iplatform {
  height: number;
  width: number;

  x: number;
  y: number;

  img: HTMLImageElement;

  constructor(x: number, y: number, height: number, width: number) {
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
    this.img = new Image();
    this.img.src = "./asset/images/platform.png";
    this.moveTile = false;
  }
  moveTile: boolean;

  drawImage(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  moveX() {
    if (this.moveTile == true) {
      console.log("true");
    }
  }
}
