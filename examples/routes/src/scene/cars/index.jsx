import React from 'react'
import {Link} from 'react-router-dom'

export default class Car extends React.Component{
  render(props){
    return [
      <Link key='link' to='/car/bus'>Bus</Link>,
      <h1 key='title'>Cars List</h1>,
      <i key='model-path'>model path: {this.props.model.path.join('.')}</i>,
      this.props.children,
    ]
  }
}
