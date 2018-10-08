import React from 'react'
import { render } from 'react-dom'

import Measure from './measure'
import model from './model'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    model.change.map(({ value, path }) => {
      if (path.join() === 'context,theme') {
        this.setState({
          theme: value.unwrap()
        })
      }
    })
  }
  render () {
    const { theme = '' } = this.state
    return <div className={'main ' + theme}>
      <button onClick={model.changeTheme}>Change Theme</button>
      <Measure title='Air' model={model.slice('temperatures.air')} />
      <Measure title='Water' model={model.slice('temperatures.water')} />
    </div>
  }
}

render(<App />, document.getElementById('app'))
