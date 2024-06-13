import { width, height } from "./constant";
import { velocity } from "./utility";

const doodlerrightPath = "./public/asset/images/doodler-right.png";

const backgroundImagePath = "./public/asset/images/doodlebg.png";

interface IPlayer {
  x: number;
  y: number;
  height: number;
  width: number;
  img: HTMLImageElement;
}

export class Player implements IPlayer {
  height: number;
  width: number;
  x: number;
  y: number;
  img: HTMLImageElement;
  velocity: any;
  canMove: boolean;

  constructor() {
    this.height = 36;
    this.width = 36;
    this.x = width / 2 - 35 / 2;
    this.y = height - 50;
    this.img = new Image();
    this.img.src = doodlerrightPath;
    this.velocity = velocity;
    this.canMove = true;
  }

  drawImage(ctx: CanvasRenderingContext2D): void {
    console.log("img", this.img);
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  moveRight(): void {
    this.velocity.x = 4;
  }

  moveLeft(): void {
    this.velocity.x = -4;
  }

  stopMove(): void {
    this.velocity.x = 0;
  }

  updatePosition(): void {
    this.x += this.velocity.x;
  }

  eventListener(): void {
    document.addEventListener("keydown", (event) => this.moveDoodler(event));
  }

  moveDoodler(event: KeyboardEvent): void {
    if (event.code === "ArrowRight") {
      this.moveRight();
    } else if (event.code === "ArrowLeft") {
      this.moveLeft();
    } else if (event.code === "ArrowUp" && this.canMove) {
      this.velocity.y += -3;
      this.canMove = false;

      setTimeout(() => {
        this.canMove = true;
      }, 1000);
    }
  }
}

export const background = new Image();
background.src = backgroundImagePath;
