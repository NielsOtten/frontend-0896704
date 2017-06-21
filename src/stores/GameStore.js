import { observable } from 'mobx';

class GameStore {
  @observable targets = [];
  @observable goodTargets = 0;
  @observable points = 0;
  @observable timePassed = 0;
  targetTime = 30;
  hits = [];
  grid = [];

  getGoodTargets() {
    this.goodTargets = this.hits.filter(hit => this.targets.includes(hit.index)).length;
  }
}

const store = new GameStore();
export default store;
