import {makeAPI} from '../util'

export default makeAPI({
  displayName: 'user',
  store: {
    userData: []
  },
  actions: {
    getUser: {
      async: true,
      timeout: 5000,
      reducer: {
        success: (store, action) => {
          store.userData = action.data
        }
      }
    }
  }
}, require('../resource/user'))
