import React, { Component } from 'react';
import { observer } from 'mobx-react';
import 'tracking/build/tracking-min';
import ColorStore from '../../stores/ColorStore';
import MainStore from '../../stores/MainStore';
import './styles.scss';

@observer
class Home extends Component {
  componentDidMount() {
    if(this.video && this.canvas) {
      const context = this.canvas.getContext('2d');
      const tracking = window.tracking;
      tracking.ColorTracker.registerColor('mainColor', (r, g, b) => {
        const trackingColor = ColorStore.color;
        return (r < trackingColor.r.max && r > trackingColor.r.min) &&
          (g < trackingColor.g.max && g > trackingColor.g.min) &&
          (b < trackingColor.b.max && b > trackingColor.b.min);
      });
      const color = new tracking.ColorTracker(['mainColor']);

      // This event listener is for debugging only. It will draw a rectangle on the canvas to show you if it has found
      // the mainColor.
      if(MainStore.isDebugging) {
        color.on('track', (event) => {
          context.clearRect(0, 0, this.canvas.width, this.canvas.height);
          if(event.data.length > 0) {
            event.data.forEach((rect) => {
              context.strokeStyle = 'red';
              context.strokeRect(rect.x, rect.y, rect.width, rect.height);
              context.font = '11px Helvetica';
              context.fillStyle = '#000';
              context.fillText(`x: ${rect.x}px`, rect.x + rect.width + 5, rect.y + 11);
              context.fillText(`y: ${rect.y}px`, rect.x + rect.width + 5, rect.y + 22);
            });
          }
        });
      }

      tracking.track(this.video, color, { camera: true });
    }
  }

  render() {
    return (
      <section>
        <div>
          <video ref={v => this.video = v} id='myVideo' width='400' height='300' preload autoPlay loop muted />
          <canvas ref={c => this.canvas = c} id='canvas' width='400' height='300' />
        </div>
      </section>
    );
  }
}

export default Home;
