import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import styles from './styles.scss';
import Game from '../../controllers/NewGame';
import Drawer from '../../controllers/Drawer';
import GameStore from '../../stores/GameStore';

@observer
class Goal extends Component {
  componentDidMount() {
    console.log(this.props);
    if(this.canvas) {
      this.drawGoals = autorun(() => {
        if(!this.drawer) this.drawer = new Drawer(this.canvas);
        this.drawer.resetDrawer();
        Game.setupGrid(this.canvas, this.drawer, 75);
        GameStore.targets.forEach((target) => {
          this.drawer.addFunction((drawer) => {
            // I use the grid index to find the correct tile to draw the goal on.
            const tile = GameStore.grid[target];
            const tileWidth = tile.rightBottomCorner.x - tile.leftUpperCorner.x;
            drawer.context.beginPath();
            // Little bit of context about those random variables in this calculation. I forgot that the canvas has
            // padding. So for now i hardcoded the integers in the code.
            // TODO: Remove hardcoded integers.
            drawer.context.arc((tile.leftUpperCorner.x + 50) + (tileWidth / 2),
              (tile.leftUpperCorner.y + 50) + (tileWidth / 2),
              tileWidth / 2,
              2 * Math.PI,
              false);
            drawer.context.fillStyle = 'red';
            drawer.context.fill();
          });
        });
        this.drawer.draw();
      });
    }
  }

  render() {
    return (
      <div className={styles.goal}>
        <canvas ref={c => this.canvas = c} id='canvas' width='400' height='400' />
      </div>
    );
  }
}

export default Goal;
