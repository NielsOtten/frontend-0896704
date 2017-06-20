export default class GridVariables {
  constructor(screenWidth, screenHeight, tileWidth) {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.tileWidth = tileWidth;
    this.tiles = 4;
  }

  get xPadding() {
    return (this.screenWidth - (this.tileWidth * this.tiles)) / 2;
  }

  get yPadding() {
    return (this.screenHeight - (this.tileWidth * this.tiles)) / 2;
  }

  get gridWidth() {
    return this.tileWidth * this.tiles;
  }
};