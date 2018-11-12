import React from 'react'

export default class People extends React.Component{
  render(){
    return [
      <h1 key='title'>People List</h1>,
      <i key='model-path'>model path: {this.props.model.path.join('.')}</i>,
    ]
  }
}
