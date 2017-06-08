import { observable, computed } from 'mobx';

class MainStore {
  @observable debugging = false;
  @computed get isDebugging() {
    return this.debugging;
  }

  toggleDebugging() {
    this.debugging = !this.debugging;
  }
}

const store = new MainStore();
export default store;
