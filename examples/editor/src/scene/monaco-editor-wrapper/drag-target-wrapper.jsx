'use strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DropTarget} from 'react-dnd';
const _ = require('lodash');
const classnames = require('classnames');

const propTypes = {
  className: PropTypes.string,
  connectDropTarget: PropTypes.func.isRequired
};

let spec = {
  drop(props, monitor) {
    if (!props.disabled) {
      props.dropCb(monitor.getItem(), monitor.getItemType());
    }
  },
  canDrop() {
    return true;
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
  };
}

class DragTargetWrapper extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {connectDropTarget} = this.props;
    return connectDropTarget(
      <div className={this.props.className}>
        {this.props.children}
      </div>
    );
  }
}
DragTargetWrapper.propTypes = propTypes;

export default DropTarget(['entity', 'tag'], spec, collect)(DragTargetWrapper);
