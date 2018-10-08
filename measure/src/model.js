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

model.fetchTemperatures = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(model.set('temperatures', {
        air: { value: 22, units: 'C' },
        water: { value: 76, units: 'F' }
      }))
    }, 1000)
  })
}

window.model = model
export default model
