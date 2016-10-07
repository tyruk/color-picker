import React from 'react';
import ReactDOM from 'react-dom';

export default class Ribbon extends React.Component {
  constructor(props) {
    super(props);

    const events = [
      'onMouseDown',
      'onDrag',
      'onDragEnd',
      'pointMoveTo',
      '_setHuePosition',
    ];
    events.forEach(e => {
      if (this[e]) {
        this[e] = this[e].bind(this);
      }
    });
  }

  componentWillUnmount() {
    this.unloaded = true;
    this.removeListeners();
  }

  onMouseDown(e) {
    const x = e.clientX;
    const y = e.clientY;

    this.pointMoveTo({
      x, y,
    });

    window.addEventListener('mousemove', this.onDrag, false);
    window.addEventListener('mouseup', this.onDragEnd, false);
  }

  onDrag(e) {
    const x = e.clientX;
    const y = e.clientY;
    this.pointMoveTo({
      x, y,
    });
  }

  onDragEnd(e) {
    const x = e.clientX;
    const y = e.clientY;
    this.pointMoveTo({
      x, y,
    });
    this.removeListeners();
  }

  getPrefixCls() {
    return this.props.rootPrefixCls + '-ribbon';
  }

  pointMoveTo(coords) {
    if (!this.unloaded) {
      const rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
      const width = rect.width;
      let left = coords.x - rect.left;
      left = Math.max(0, left);
      left = Math.min(left, width);
      const huePercent = left / width;
      const hue = huePercent * 360;
      // 新的对象, 避免引用
      const hsv = {
        ...this.props.hsv,
        h: hue,
      };
      this.props.onChange(hsv);
    }
  }

  removeListeners() {
    window.removeEventListener('mousemove', this.onDrag, false);
    window.removeEventListener('mouseup', this.onDragEnd, false);
  }

  render() {
    const prefixCls = this.getPrefixCls();
    const HSV = this.props.hsv;
    const hue = HSV.h;
    const per = hue / 360 * 100;
    return (
      <div className={prefixCls}>
        <span ref="point" style={{left: per + '%'}}></span>

        <div
          className={prefixCls + '-' + ('handler')}
          onMouseDown={this.onMouseDown}
          ></div>
      </div>
    );
  }
}

Ribbon.propTypes = {
  rootPrefixCls: React.PropTypes.string,
  hsv: React.PropTypes.object,
  onChange: React.PropTypes.func,
};
