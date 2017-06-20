import { observable } from 'mobx';

class GameStore {
  @observable playing = false;
  @observable grid = [];
  @observable hits = [];
  @observable targets = [];
  @observable goodTargets = 0;

  getGoodTargets() {
    this.goodTargets = this.hits.filter(hit => this.targets.includes(hit.index)).length;
  }
}


const store = new GameStore();
export default store;
