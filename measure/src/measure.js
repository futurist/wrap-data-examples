import React from 'react'

const convert = (value, to) => Math.round(
  (to === 'C') ? ((value - 32) / 9 * 5) : (value * 9 / 5 + 32)
)

class Measure extends React.Component {
  constructor (props) {
    super(props)
    const { model } = props
    this.state = model.unwrap()
    model.change.map(({ value, type, path }) => {
      console.log(value(), type, path)
      this.setState({
        [path]: value.unwrap()
      })
    })
    this.add = () => {
      model.getset('value', v => v.unwrap() + 1)
    }
    this.minus = () => {
      model.getset('value', v => v.unwrap() - 1)
    }
    this.changeUnit = () => {
      model.getset('units', v => {
        const isF = v() === 'F'
        const units = isF ? 'C' : 'F'
        model.getset('value', value => convert(value.unwrap(), units))
        return units
      })
    }
  }
  render () {
    const { value, units } = this.state
    return <div>
      <div>{this.props.title} temperatures: {value}&deg;{units}</div>
      <button onClick={this.add}>+</button>
      <button onClick={this.minus}>-</button>
      <button onClick={this.changeUnit}>Change Unit</button>
      <button onClick={this.props.model.root.changeTheme}>Change Theme</button>
    </div>
  }
}

export default Measure
