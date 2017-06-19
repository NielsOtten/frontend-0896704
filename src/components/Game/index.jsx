import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Game from '../../Game/Game';
import styles from './styles.scss';
import GameStore from '../../stores/GameStore';

@observer
class GameComponent extends Component {
  componentDidMount() {
    this.setupCamera();
    this.game = new Game(this.canvas, this.video);
  }

  setupCamera() {
    window.navigator.getUserMedia({
      video: true,
    }, (stream) => {
      try {
        this.video.src = window.URL.createObjectURL(stream);
      } catch(err) {
        this.video.src = stream;
      }
    }, () => { throw Error('Cannot capture user camera.'); });
  }

  startGame = () => {
    this.game.startGame();
  };

  render() {
    return (
      <div>
        <div className={styles.board}>
          <div className={styles.levelDisplay}>
            { GameStore.targets.map(target => <span key={target}>Target: { target }</span>) }
            <div>
              { GameStore.goodTargets }
            </div>
            <div>
            </div>
          </div>
        </div>
        <video ref={v => this.video = v} id='myVideo' width='533' height='400' preload autoPlay loop muted />
        <canvas ref={c => this.canvas = c} id='canvas' width='533' height='400' />
        <button onClick={this.startGame}>Start Game</button>
      </div>
    );
  }
}

export default GameComponent;
