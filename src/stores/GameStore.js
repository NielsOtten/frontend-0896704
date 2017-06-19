import { observable } from 'mobx';

class GameStore {
  @observable playing = false;
  @observable grid = [];
  @observable hits = [];
  @observable targets = [];
  @observable goodTargets = 0;
}


const store = new GameStore();
export default store;
