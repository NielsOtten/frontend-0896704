
class Drawer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.context = canvasElement.getContext('2d');
    this.drawArray = [];
    window.requestAnimationFrame(this.update.bind(this));
  }

  addFunction(func) {
    this.drawArray.push(func);
  }

  update() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawArray.forEach((func) => { func(this); });
    window.requestAnimationFrame(this.update.bind(this));
  }
}

export default Drawer;
