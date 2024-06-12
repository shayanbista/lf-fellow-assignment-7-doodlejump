import { width, height } from "./constant";



let doodlerWidth = 35;
let doodlerHeight = 35;
let doodlerX = width / 2 - doodlerWidth / 2;
let doodlerY = height - 50;
// let doodlerLeftImage;

export const doodlerRightImage = new Image();
doodlerRightImage.src = "./public/asset/images/doodler-right.png";
export const doodlebackground = new Image();
doodlebackground.src = "./public/asset/images/doodlebg.png";
export let doodler = {
  x: doodlerX,
  y: doodlerY,
  height: doodlerHeight,
  width: doodlerWidth,
};
