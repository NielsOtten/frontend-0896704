import { observable } from 'mobx';

class GameStore {
  @observable targets = [];
  @observable goodTargets = 0;
  @observable points = 0;
  @observable timePassed = 0;
  @observable playing = false;
  targetTime = 30;
  hits = [];
  grid = [];

  getGoodTargets() {
    this.goodTargets = this.hits.filter(hit => {
      let index = 0;
      switch(hit.index) {
        case 0:
          index = 15;
          break;
        case 1:
          index = 14;
          break;
        case 2:
          index = 13;
          break;
        case 3:
          index = 12;
          break;
        case 4:
          index = 11;
          break;
        case 5:
          index = 10;
          break;
        case 6:
          index = 9;
          break;
        case 7:
          index = 8;
          break;
        case 8:
          index = 7;
          break;
        case 9:
          index = 6;
          break;
        case 10:
          index = 5;
          break;
        case 11:
          index = 4;
          break;
        case 12:
          index = 3;
          break;
        case 13:
          index = 2;
          break;
        case 14:
          index = 1;
          break;
        case 15:
          index = 0;
          break;
      }
      console.log(this.targets[0], index, hit.index);
      return this.targets.includes(index);
    }).length;
  }
}

const store = new GameStore();
export default store;
