'use strict';

import React from 'react'
import {Link} from 'react-router-dom'

class Wrapper extends React.Component {
  render() {
    return <div className="wrapper">
      <nav key='nav'>
        <Link to='/car'>Car</Link>&nbsp;
        <Link to='/people'>People</Link>
      </nav>
      <i key='model-path'>model path: {this.props.model.path.join('.')}</i>
        {
          this.props.children
        }
      </div>
  }
}

export default Wrapper
