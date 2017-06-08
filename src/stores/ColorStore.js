import { observable, computed } from 'mobx';

export const RED = {
  r: { max: 255, min: 139 },
  b: { max: 50, min: 0 },
  g: { max: 50, min: 0 },
};
export const BLUE = {
  r: { max: 50, min: 0 },
  b: { max: 255, min: 139 },
  g: { max: 50, min: 0 },
};
export const GREEN = {
  r: { max: 50, min: 0 },
  b: { max: 50, min: 0 },
  g: { max: 255, min: 139 },
};

class ColorStore {
  @observable mainColor = RED;
  @computed get color() {
    return this.mainColor;
  }
}

const store = new ColorStore();
export default store;
