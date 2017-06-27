/* eslint-disable prefer-template */
import React, { Component } from 'react';
import { observable, autorun } from 'mobx';
import { observer } from 'mobx-react';
import 'tracking/build/tracking-min';
import Goal from './Goal';
import Board from '../../controllers/Board';
import styles from './styles.scss';
import GameStore from '../../stores/GameStore';
import intro from '../../sound/intro-game.mp3';

@observer
class GameComponent extends Component {
  componentDidMount() {
    this.setupCamera();
    this.board = new Board(this.canvas, this.video);

    this.checkGames = autorun(() => {
      if(this.board.games.length > this.games.length) {
        this.games.push(<Goal key={this.games.length} index={this.games.length} board={this.board} />);
      }
    });
  }

  /**
   * This function is used to start the camera before the game starts.
   */
  setupCamera() {
    const userMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    userMedia.call(navigator, {
      video: true,
    }, (stream) => {
      try {
        this.video.src = window.URL.createObjectURL(stream);
      } catch(err) {
        this.video.src = stream;
      }
    }, () => { throw Error('Cannot capture user camera.'); });
  }

  @observable games = [];
  @observable timer = 4;
  @observable displayTimer = false;

  startGame = () => {
    this.board.newGame();
    const introAudio = new Audio(intro);
    introAudio.play();
    introAudio.onended = () => {
      this.interval = setInterval(() => {
        if(this.timer === 0) {
          clearInterval(this.interval);
          this.board.startGame();
          this.displayTimer = false;
          return;
        }
        this.displayTimer = true;
        this.timer -= 1;
      }, 1000);
    };
  };

  render() {
    return (
      <div>
        <div className={styles.time}>Tijd over: {GameStore.targetTime - GameStore.timePassed}</div>
        <div className={styles.points}>Punten: {GameStore.points}</div>
        { this.games }
        <div className={styles.game} />
        <div className={styles.timer + ' ' + (this.displayTimer ? styles.active : '')}>{this.timer}</div>
        <div className={styles.video}>
          <video className={styles.canvasGame} ref={v => this.video = v} id='myVideo' width='533' height='400' preload autoPlay loop muted />
          <canvas className={styles.videoGame} ref={c => this.canvas = c} id='canvas' width='533' height='400' />
        </div>
        { !GameStore.playing ? <button className={styles.startGame} onClick={this.startGame}>Start spel</button> : '' }
      </div>
    );
  }
}

export default GameComponent;
