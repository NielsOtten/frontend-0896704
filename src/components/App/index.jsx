
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styles from './styles.scss';
import submarine from '../../sound/submarine.mp3';

class App extends Component {
  componentDidMount() {
    this.audio.volume -= 0.6;
  }

  render() {
    return (
      <div>
        <audio ref={a => this.audio = a} autoPlay loop>
          <source src={submarine} />
        </audio>
        <nav>
          <Link to='/'>Home</Link>
          <Link to='/settings'>Settings</Link>
        </nav>
        <div className={styles.content}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
