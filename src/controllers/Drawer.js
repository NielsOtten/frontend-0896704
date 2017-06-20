
class Drawer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.context = canvasElement.getContext('2d');
    this.drawArray = [];
  }

  addFunction(func) {
    this.drawArray.push(func);
  }

  resetDrawer() {
    this.drawArray = [];
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawArray.forEach((func) => { func(this); });
  }
}

export default Drawer;
