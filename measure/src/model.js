import flyd from 'flyd'
import wrapData from 'wrap-data'

const model = wrapData(flyd.stream)({
  'context': {
    'theme': ''
  },
  'temperatures': {
    'air': {
      'value': 20,
      'units': 'C'
    },
    'water': {
      'value': 73,
      'units': 'F'
    }
  }
})

model.changeTheme = () => {
  model.getset('context.theme', v => v() === 'dark' ? '' : 'dark')
}

export default model
