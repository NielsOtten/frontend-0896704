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
    this.setupGrid();
    this.startWatching();
    GameStore.targets = [this.pickRandomTile(), this.pickRandomTile()];
  }

  pickRandomTile() {
    return Math.floor(Math.random() * 16);
  }

  startWatching() {
    const tracking = window.tracking;
    tracking.ColorTracker.registerColor('mainColor', (r, g, b) => {
      const trackingColor = ColorStore.color;
      return (r < trackingColor.r.max && r > trackingColor.r.min) &&
        (g < trackingColor.g.max && g > trackingColor.g.min) &&
        (b < trackingColor.b.max && b > trackingColor.b.min);
    });
    const color = new tracking.ColorTracker(['mainColor']);

    // This event listener is for debugging only. It will draw a rectangle on the canvas to show you if it has found
    // the mainColor.
    if(MainStore.isDebugging) {
      color.on('track', (event) => {
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

      tracking.track(this.video, color, { camera: true });
    }

    color.on('track', (event) => {
      if(event.data.length > 0 && GameStore.grid.length > 0) {
        event.data.forEach((object) => {
          GameStore.hits = Game.getHit(object);
          Game.getGoodTargets();
        });
      }
    });
  }

  /*
   * I use a foreach here, because i wanted to keep the index. This index is needed to
   * get the grid from GameStore. The first choice to go would be filter, but then i
   * won't keep the index.
   */
  static getHit(object) {
    const tiles = [];
    GameStore.grid.forEach((tile, index) => {
      if(!(tile.rightBottomCorner.x < object.x ||
        tile.leftUpperCorner.x > object.x + object.width ||
        tile.rightBottomCorner.y < object.y ||
        tile.leftUpperCorner.y > object.y + object.height)) {
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
   * This function will setup the grid over the canvas.
   * The grid is the game board.
   */
  setupGrid() {
    const xPadding = 86.5;
    const yPadding = 20;
    const blockWidth = 90;

    this.drawer.addFunction((drawer) => {
      const gridWidth = 360;
      const gridHeight = 360;
      for(let x = 0; x <= gridWidth; x += blockWidth) {
        drawer.context.moveTo(xPadding + x, yPadding);
        drawer.context.lineTo(xPadding + x, gridHeight + yPadding);
      }
      for(let x = 0; x <= gridHeight; x += blockWidth) {
        drawer.context.moveTo(xPadding, 0.5 + x + yPadding);
        drawer.context.lineTo(gridWidth + xPadding, 0.5 + x + yPadding);
      }
      drawer.context.strokeStyle = 'black';
      drawer.context.stroke();
    });

    GameStore.grid = [];
    // Setup grid in store
    for(let x = 0; x < 4; x += 1) {
      for(let y = 0; y < 4; y += 1) {
        const box = {
          leftUpperCorner: {
            x: xPadding + (blockWidth * x),
            y: yPadding + (blockWidth * y),
          },
          rightBottomCorner: {
            x: xPadding + blockWidth + (blockWidth * x),
            y: yPadding + blockWidth + (blockWidth * y),
          },
        };
        GameStore.grid.push(box);
      }
    }
  }
}

export default Game;
