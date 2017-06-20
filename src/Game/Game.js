import { autorun } from 'mobx';
import GridVariables from './GridVariables';
import Drawer from './Drawer';
import ColorStore from '../stores/ColorStore';
import MainStore from '../stores/MainStore';
import GameStore from '../stores/GameStore';

class Game {
  constructor(canvas, video) {
    this.canvas = canvas;
    this.video = video;
    this.drawer = new Drawer(canvas);
  }

  startGame() {
    GameStore.playing = true;
    Game.setupGrid(this.canvas, this.drawer, 75);
    window.requestAnimationFrame(this.update.bind(this));
    this.addGriddToStore();
    this.startWatching();
    GameStore.targets = [this.pickRandomTile(), this.pickRandomTile()];
    this.checkwon = autorun(() => {
      console.log(GameStore.goodTargets, GameStore.targets.length);
      if(GameStore.goodTargets >= GameStore.targets.length) {
        if(this.color) { this.color.removeAllListeners(); }
        GameStore.goodTargets = 0;
        this.startGame();
      }
    });
  }

  /**
   * Draw the canvas on every possible animationFrame.
   */
  update() {
    this.drawer.draw();
    window.requestAnimationFrame(this.update.bind(this));
  }

  pickRandomTile() {
    let randomInt = Math.floor(Math.random() * 16);
    while(GameStore.targets.includes(randomInt)) {
      randomInt = Math.floor(Math.random() * 16);
    }
    return randomInt;
  }

  startWatching() {
    const tracking = window.tracking;
    tracking.ColorTracker.registerColor('mainColor', (r, g, b) => {
      const trackingColor = ColorStore.color;
      return (r < trackingColor.r.max && r > trackingColor.r.min) &&
        (g < trackingColor.g.max && g > trackingColor.g.min) &&
        (b < trackingColor.b.max && b > trackingColor.b.min);
    });
    this.color = new tracking.ColorTracker(['mainColor']);
    tracking.track(this.video, this.color, { camera: true });

    // This event listener is for debugging only. It will draw a rectangle on the canvas to show you if it has found
    // the mainColor.
    if(MainStore.isDebugging) {
      this.color.on('track', (event) => {
        if(event.data.length > 0) {
          event.data.forEach((rect) => {
            this.drawer.context.strokeStyle = 'red';
            this.drawer.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            this.drawer.context.fillStyle = '#000';
            this.drawer.context.fillText(`x: ${rect.x}px`, rect.x + rect.width + 5, rect.y + 11);
            this.drawer.context.fillText(`y: ${rect.y}px`, rect.x + rect.width + 5, rect.y + 22);
          });
        }
      });
    }

    this.color.on('track', this.trackHit);
  }

  trackHit(event) {
    if(event.data.length > 0 && GameStore.grid.length > 0) {
      event.data.forEach((object) => {
        // Get all the tiles which get hit.
        GameStore.hits = Game.getHit(object);
        // Check if there are any hits actually in the good target.
        Game.getGoodTargets();
      });
    }
  }

  addGriddToStore() {
    const grid = new GridVariables(this.canvas.width, this.canvas.height, 75);
    GameStore.grid = [];
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
        GameStore.grid.push(box);
      }
    }
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

    // Ratio
  // .map(box => ({ box, ratio: Math.max(0, Math.min(box.rightBottomCorner.x, object.x + object.width) - Math.max(box.leftUpperCorner.x, object.x)) * Math.max(0, Math.min(box.rightBottomCorner.y, object.y + object.height) - Math.max(box.leftUpperCorner.y, object.y)) }));
  }

  static getGoodTargets() {
    GameStore.goodTargets = GameStore.hits.filter(hit => GameStore.targets.includes(hit.index)).length;
  }

  /**
   * This function will setup the grid over a given canvas.
   */
  static setupGrid(canvas, newDrawer, tileWidth) {
    const grid = new GridVariables(canvas.width, canvas.height, tileWidth);
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
