'use strict';

import React from 'react'
import {Link} from 'react-router-dom'

class Wrapper extends React.Component {
  render() {
    return <div className="wrapper">
      <nav>
        <Link to='/car'>Car</Link>&nbsp;
        <Link to='/people'>People</Link>
      </nav>
        {
          this.props.children
        }
      </div>
  }
}

export default Wrapper
