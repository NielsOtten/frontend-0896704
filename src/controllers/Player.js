import GameStore from '../stores/GameStore';

class Player {
  static addPoint(points) {
    if(points) return GameStore.points += points;
    return GameStore.points += 1;
  }
}
