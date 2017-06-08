import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ColorStore from '../../../stores/ColorStore';
import styles from './styles.scss';

class SetColorComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      running: false,
      color: props.color,
    };

    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler(e) {
    e.preventDefault();
    this.setState({ running: true });
    this.createBox();
    const tracking = this.props.tracking;

    // Add NullColor, This is called null color because i want tracking js to track every color in the box that
    // is just created. I will check if there are any drastically changed colors and then use that color as the main
    // color for the color given in the proptypes.
    tracking.ColorTracker.registerColor('nullColor', (r, g, b) => {
      R 255 B 0 G 0
    });
    const nullColor = new tracking.ColorTracker(['nullColor']);
    nullColor.on('track', (e) => {
      if(e.data.length > 0) {
        e.data.forEach((rect) => {
          console.log(rect);
        });
      }
    });
    tracking.track(this.props.video, nullColor, { camera: true });
  }

  createBox() {
    const contextWidth = this.props.context.canvas.width;
    const contextHeight = this.props.context.canvas.height;
    this.props.context.strokeStyle = 'black';
    // Draw a rectangle in the middle of the screen. In this rectangle they need to place the blocks.
    this.props.context.strokeRect(contextWidth / 3, contextHeight / 3, contextWidth / 3, contextHeight / 3);
  }

  render() {
    return (
      <button className={styles.colorButton} onClick={this.clickHandler}>Set color</button>
    );
  }
}

SetColorComponent.propTypes = {
  color: PropTypes.string.isRequired,
  context: PropTypes.object.isRequired,
  tracking: PropTypes.object.isRequired,
  video: PropTypes.object.isRequired,
};

export default SetColorComponent;
