import React from 'react'
import {Link} from 'react-router-dom'

export default class Car extends React.Component{
  render(props){
    return [
      <Link key={2} to='/car/bus'>Bus</Link>,
      <h1 key={1}>Cars List</h1>,
      this.props.children
    ]
  }
}
