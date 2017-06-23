import { observable, autorun } from 'mobx';
import Game from './Game';
import GameStore from '../stores/GameStore';
import Player from './Player';
import lekkerBezigAudio from '../sound/Jij-bent-lekker-bezig_.mp3';
import slechtBezigAudio from '../sound/Ah_-net-niet-binnen-de-tijd.-Probeer-het-nog-eens..mp3';

/**
 * This class is the base of the game. Here will be all functionalities for setting up a new game.
 */
class Board {
  @observable games = [];
  feedback = null;

  /**
   * Constructor for the class Board.
   * @param {Element} canvas
   * @param {Element} video
   */
  constructor(canvas, video) {
    this.tracking = window.tracking;
    this.canvas = canvas;
    this.video = video;
  }

  /**
   * When there is a change in GameStore then this function
   * will automatically get triggered. It will check if the last game
   * you were playing is won.
   */
  checkStatus = autorun(() => {
    if(this.games.length > 0 &&
      GameStore.targets.length > 0 &&
      this.games[this.games.length - 1].active) {
      if(GameStore.goodTargets >= GameStore.targets.length) {
        Player.addPoint(100);
        this.stopGame();
        this.feedback = new Audio(lekkerBezigAudio);
        this.feedback.play();
        this.feedback.onended = () => {
          this.newGame();
          this.startGame();
        };
      }
      if(GameStore.targetTime <= GameStore.timePassed) {
        this.stopGame();
        this.feedback = new Audio(slechtBezigAudio);
        this.feedback.play();
        this.feedback.onended = () => {
          this.newGame();
          this.startGame();
        };
      }
    }
  });

  /**
   * Add a new game to the list of games.
   */
  newGame() {
    GameStore.playing = true;
    const newGame = new Game(this.canvas, this.video);
    this.games.push(newGame);
    return newGame;
  }

  startGame() {
    if(this.games.length > 0) {
      this.games[this.games.length - 1].startGame();
    }
  }

  stopGame() {
    if(this.games.length > 0) {
      this.games[this.games.length - 1].stopGame();
    }
  }
}

export default Board;
