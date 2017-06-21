import Drawer from './Drawer';
import GridVariables from '../utils/GridVariables';
import ColorStore from '../stores/ColorStore';
import GameStore from '../stores/GameStore';

/**
 * Game class, every functionality for a Game will be handled here.
 */
class Game {
  static tileWidth = 75;
  active = false;
  grid = [];

  /**
   * Constructor for Game class.
   */
  constructor(canvas, video) {
    this.tracking = window.tracking;
    this.canvas = canvas;
    this.video = video;
    this.drawer = new Drawer(canvas);
  }

  startGame() {
    Game.setupGrid(this.canvas, this.drawer, Game.tileWidth);
    this.addGridToStore();
    this.startWatcher();
    this.startTimer();
    this.active = true;

    // TODO: Always 2 targets, need to make it more random.
    GameStore.targets = [Game.pickRandomTile(), Game.pickRandomTile()];

    if(!this.animation) window.requestAnimationFrame(this.update.bind(this));
  }

  startTimer() {
    GameStore.timePassed = 0;
    this.interval = setInterval(() => {
      GameStore.timePassed += 1;
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.interval);
  }

  /**
   * Draw the canvas on every possible animationFrame.
   */
  update() {
    this.drawer.draw();
    this.animation = window.requestAnimationFrame(this.update.bind(this));
  }

  /**
   * This function will start watching the video for the color i just registered.
   */
  startWatcher() {
    this.tracking.ColorTracker.registerColor('mainColor', (r, g, b) => {
      const trackingColor = ColorStore.color;
      return (r < trackingColor.r.max && r > trackingColor.r.min) &&
        (g < trackingColor.g.max && g > trackingColor.g.min) &&
        (b < trackingColor.b.max && b > trackingColor.b.min);
    });
    this.color = new this.tracking.ColorTracker(['mainColor']);
    this.videoTrack = this.tracking.track(this.video, this.color, { camera: true });

    this.color.on('track', (event) => {
      if(event.data.length > 0 && GameStore.grid.length > 0) {
        event.data.forEach((object) => {
          // Get all the tiles which get hit.
          GameStore.hits = Game.getHit(object);
          // Check if there are any hits actually in the good target.
          GameStore.getGoodTargets();
        });
      }
    });
  }

  stopGame() {
    if(this.color) this.color.removeAllListeners();
    if(this.videoTrack) this.videoTrack.stop();
    GameStore.goodTargets = 0;
    this.drawer.resetDrawer();
    this.stopTimer();
    this.active = false;
  }

  static pickRandomTile() {
    let randomInt = Math.floor(Math.random() * 16);
    while(GameStore.targets.includes(randomInt)) {
      randomInt = Math.floor(Math.random() * 16);
    }
    return randomInt;
  }

  /**
   * Adds grid to the store, this is needed for the
   */
  addGridToStore() {
    const grid = new GridVariables(this.canvas.width, this.canvas.height, 75);
    const tiles = [];
    // Setup grid in store
    for(let y = 0; y < 4; y += 1) {
      for(let x = 0; x < 4; x += 1) {
        const box = {
          leftUpperCorner: {
            x: grid.tileWidth * x,
            y: grid.tileWidth * y,
          },
          rightBottomCorner: {
            x: grid.tileWidth + (grid.tileWidth * x),
            y: grid.tileWidth + (grid.tileWidth * y),
          },
        };
        tiles.push(box);
      }
    }
    GameStore.grid = tiles;
  }

  /*
   * I use a foreach here, because i wanted to keep the index. This index is needed to
   * get the grid from GameStore. The first choice to go would be filter, but then i
   * won't keep the index.
   */
  static getHit(object) {
    const tiles = [];
    GameStore.grid.forEach((tile, index) => {
      if(!(tile.rightBottomCorner.x + 116.5 < object.x ||
        tile.leftUpperCorner.x + 116.5 > object.x + object.width ||
        tile.rightBottomCorner.y + 50 < object.y ||
        tile.leftUpperCorner.y + 50 > object.y + object.height)) {
        tiles.push({
          index,
          tile,
        });
      }
    });
    return tiles;
  }

  /**
   * This will setup a grid and add it to the local grid variable.
   * It will add the elements it needs to draw to a drawer so the drawer will handle
   * the canvas drawing.
   * @param {Element} canvas
   * @param {Drawer} newDrawer
   * @param {int} tileWidth
   */
  static setupGrid(canvas, newDrawer, tileWidth) {
    const grid = new GridVariables(canvas.width, canvas.height, tileWidth);
    newDrawer.resetDrawer();
    newDrawer.addFunction((drawer) => {
      for(let x = 0; x <= grid.gridWidth; x += grid.tileWidth) {
        drawer.context.moveTo(grid.xPadding + x, grid.yPadding);
        drawer.context.lineTo(grid.xPadding + x, grid.gridWidth + grid.yPadding);
      }
      for(let x = 0; x <= grid.gridWidth; x += grid.tileWidth) {
        drawer.context.moveTo(grid.xPadding, 0.5 + x + grid.yPadding);
        drawer.context.lineTo(grid.gridWidth + grid.xPadding, 0.5 + x + grid.yPadding);
      }
      drawer.context.strokeStyle = 'black';
      drawer.context.stroke();
    });
  }
}

export default Game;
