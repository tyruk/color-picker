import Colr from 'colr';
import React from 'react';
import ReactDOM from 'react-dom';

const colr = new Colr();

const WIDTH = 200;
const HEIGHT = 150;

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const events = [
      'onBoardMouseDown',
      'onBoardDrag',
      'onBoardDragEnd',
      'onBoardTouchStart',
      'onBoardTouchMove',
      'onBoardTouchEnd',
    ];
    events.forEach((m)=> {
      this[m] = this[m].bind(this);
    });
  }

  componentWillUnmount() {
    this.unloaded = true;
    this.removeListeners();
    this.removeTouchListeners();
  }

  onBoardMouseDown(e) {
    const x = e.clientX;
    const y = e.clientY;
    this.pointMoveTo({
      x,
      y,
    });

    window.addEventListener('mousemove', this.onBoardDrag, false);
    window.addEventListener('mouseup', this.onBoardDragEnd, false);
  }

  onBoardTouchStart(e) {
    if (e.touches.length !== 1) {
      return;
    }

    const x = e.targetTouches[0].clientX;
    const y = e.targetTouches[0].clientY;
    this.pointMoveTo({
      x,
      y,
    });
    window.addEventListener('touchmove', this.onBoardTouchMove, false);
    window.addEventListener('touchend', this.onBoardTouchEnd, false);
  }

  onBoardTouchMove(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    const x = e.targetTouches[0].clientX;
    const y = e.targetTouches[0].clientY;
    this.pointMoveTo({
      x,
      y,
    });
  }

  onBoardTouchEnd() {
    this.removeTouchListeners();
  }

  onBoardDrag(e) {
    const x = e.clientX;
    const y = e.clientY;
    this.pointMoveTo({
      x,
      y,
    });
  }

  onBoardDragEnd(e) {
    const x = e.clientX;
    const y = e.clientY;
    this.pointMoveTo({
      x,
      y,
    });
    this.removeListeners();
  }

  getPrefixCls() {
    return this.props.rootPrefixCls + '-board';
  }

  removeTouchListeners() {
    window.removeEventListener('touchmove', this.onBoardTouchMove, false);
    window.removeEventListener('touchend', this.onBoardTouchEnd, false);
  }

  removeListeners() {
    window.removeEventListener('mousemove', this.onBoardDrag, false);
    window.removeEventListener('mouseup', this.onBoardDragEnd, false);
  }

  /**
   * 移动光标位置到
   * @param  {object} pos X Y 全局坐标点
   * @return {undefined}
   */
  pointMoveTo(pos) {
    if (!this.unloaded) {
      const rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
      let left = pos.x - rect.left;
      let top = pos.y - rect.top;

      left = Math.max(0, left);
      left = Math.min(left, WIDTH);
      top = Math.max(0, top);
      top = Math.min(top, HEIGHT);

      const hsv = {
        h: this.props.hsv.h,
        s: parseInt(left / WIDTH * 100, 10),
        v: parseInt((1 - top / HEIGHT) * 100, 10),
      };
      this.props.onChange(hsv);
    }
  }

  render() {
    const prefixCls = this.getPrefixCls();
    const hsv = this.props.hsv;
    const hueHsv = [hsv.h, 100, 100];
    const hueColor = colr.fromHsvArray(hueHsv).toHex();
    const x = hsv.s / 100 * WIDTH - 4;
    const y = (1 - hsv.v / 100) * HEIGHT - 4;
    return (
      <div className={prefixCls}>
        <div className={prefixCls + '-' + ('hsv')} style={{backgroundColor: hueColor}}>
          <div className={prefixCls + '-' + ('value')}/>
          <div className={prefixCls + '-' + ('saturation')}/>
        </div>
        <span style={{left: x, top: y}}/>

        <div
          className={prefixCls + '-' + ('handler')}
          onMouseDown={this.onBoardMouseDown}
          onTouchStart={this.onBoardTouchStart}
          />
      </div>
    );
  }
}


Board.propTypes = {
  hsv: React.PropTypes.object,
  onChange: React.PropTypes.func,
  rootPrefixCls: React.PropTypes.string,
};
