'use strict';

import React from 'react'
import {Link} from 'react-router-dom'

import Monaco from './monaco-editor-wrapper/monaco-editor-wrapper'

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
        <Monaco
          searchType='1'
          changeType={v=>v}
          editCode={v=>v}
          code={` SELECT * from user; `}
          isReadOnly={false}
        ></Monaco>
      </div>
  }
}

export default Wrapper
