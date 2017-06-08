import React, { Component } from 'react';
import MainStore from '../../stores/MainStore';
import styles from './styles.scss';

class Settings extends Component {
  debugClickListener = () => {
    MainStore.toggleDebugging();
  };

  render() {
    return (
      <div className={styles.settings}>
        <h2>Settings</h2>
        <div>
          <input type='checkbox' name='debug' id='debug' onChange={this.debugClickListener} defaultChecked={MainStore.isDebugging} />
          <label htmlFor='debug'>Enable debugger</label>
        </div>
      </div>
    );
  }
}

export default Settings;
