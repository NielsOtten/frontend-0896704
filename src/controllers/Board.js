import { observable, autorun } from 'mobx';
import Game from './NewGame';
import GameStore from '../stores/GameStore';

/**
 * This class is the base of the game. Here will be all functionalities for setting up a new game.
 */
class Board {
  @observable games = [];

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
        this.stopGame();
        // GAME IS WON.
        console.log('won');
      }
      if(GameStore.targetTime <= GameStore.timePassed) {
        this.stopGame();
        // Game lost.
        console.log('lost');
      }
    }
  });

  /**
   * Add a new game to the list of games.
   */
  newGame() {
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