/**
 * This Drawer class is used to organise the drawings on a canvas.
 */
class Drawer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.context = canvasElement.getContext('2d');
    this.drawArray = [];
  }

  /**
   * Add a function to the drawArray.
   *
   * @param func
   */
  addFunction(func) {
    this.drawArray.push(func);
  }

  /**
   * Remove all functions from the drawArray.
   */
  resetDrawer() {
    this.drawArray = [];
  }

  /**
   * Draw everything that is inside the drawArray.
   */
  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawArray.forEach((func) => { func(this); });
  }
}

export default Drawer;
