
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './styles.scss';

function App({ children }) {
  return (
    <div>
      <nav>
        <Link to='/'>Home</Link>
        <Link to='/settings'>Settings</Link>
      </nav>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
