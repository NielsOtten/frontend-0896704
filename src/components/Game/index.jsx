import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Goal from './Goal';
import Game from '../../Game/Game';
import styles from './styles.scss';
import GameStore from '../../stores/GameStore';

@observer
class GameComponent extends Component {
  componentDidMount() {
    this.setupCamera();
    this.game = new Game(this.canvas, this.video);
  }

  /**
   * This function is used to start the camera before the game starts.
   */
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
        { GameStore.targets.length > 0 ? <Goal /> : ''}
        <div className={styles.game} />
        <div className={styles.video}>
          <video ref={v => this.video = v} id='myVideo' width='533' height='400' preload autoPlay loop muted />
          <canvas ref={c => this.canvas = c} id='canvas' width='533' height='400' />
        </div>
        { !GameStore.playing ? <button className={styles.startGame} onClick={this.startGame}>Start spel</button> : '' }
      </div>
    );
  }
}

export default GameComponent;
