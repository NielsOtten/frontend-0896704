import React, { Component } from 'react';
import 'tracking/build/tracking-min';
import Game from '../Game';
import './styles.scss';

class Home extends Component {

  render() {
    return (
      <section>
        <Game />
      </section>
    );
  }
}

export default Home;
