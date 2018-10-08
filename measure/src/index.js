import React from 'react'
import { render } from 'react-dom'

import Measure from './measure'
import model from './model'

class App extends React.Component {
  constructor (props) {
    super(props)
    model.change.map(({ value, type, path }) => {
      const _path = path.join()
      if (_path === 'context,theme' || _path === 'temperatures') {
        this.forceUpdate()
      }
    })
  }
  render () {
    const { theme = '' } = model.unwrap('context')
    console.log(this.state, model.unwrap('temperatures'))
    return <div className={'main ' + theme}>
      <button onClick={model.fetchTemperatures}>Fetch Temperatures</button>
      <button onClick={model.changeTheme}>Change Theme</button>
      <Measure title='Air' model={model.slice('temperatures.air')} />
      <Measure title='Water' model={model.slice('temperatures.water')} />
    </div>
  }
}

render(<App />, document.getElementById('app'))
