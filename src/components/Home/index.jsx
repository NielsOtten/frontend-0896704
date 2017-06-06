import React, { Component } from 'react';
import 'tracking/build/tracking-min';
import './styles.scss';

class Home extends Component {
  componentDidMount() {
    if(this.video && this.canvas) {
      const context = this.canvas.getContext('2d');
      const tracking = window.tracking;
      tracking.ColorTracker.registerColor('red', (r, g, b) => {
        const dx = r - 219;
        const dy = g - 90;
        const dz = b - 133;

        if((b - g) >= 100 && (r - g) >= 60) {
          return true;
        }
        return (dx * dx) + (dy * dy) + (dz * dz) < 3500;
      });
      const colors = new tracking.ColorTracker(['red']);

      colors.on('track', (event) => {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if(event.data.length === 0) {
          // No colors were detected in this frame.
        } else {
          event.data.forEach((rect) => {
            console.log(rect.x, rect.y, rect.width, rect.height);
            context.strokeStyle = rect.color;
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            context.font = '11px Helvetica';
            context.fillStyle = '#fff';
            context.fillText(`x: ${rect.x}px`, rect.x + rect.width + 5, rect.y + 11);
            context.fillText(`y: ${rect.y}px`, rect.x + rect.width + 5, rect.y + 22);
          });
        }
      });

      tracking.track(this.video, colors, { camera: true });
    }
  }

  render() {
    return (
      <section>
        bla
        <video ref={v => this.video = v} id='myVideo' width='400' height='300' preload autoPlay loop muted />
        <canvas ref={c => this.canvas = c} id='canvas' width='400' height='300' />
      </section>
    );
  }
}

export default Home;
