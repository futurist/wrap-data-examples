import React from 'react'

export default class Bus extends React.Component{
  render(){
    return [
      <h3 key='title'>Bus List</h3>,
      <i key='model-path'>model path: {this.props.model.path.join('.')}</i>
    ]
  }
}
