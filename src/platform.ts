import { ctx } from "./main";

interface Iplatform {
  x: number;
  y: number;
  height: number;
  width: number;
  img: HTMLImageElement;
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
    this.img.src = "./public/asset/images/platform.png";
  }

  drawImage(): void {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}
