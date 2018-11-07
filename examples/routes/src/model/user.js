import {genAPI} from '../util'

export default genAPI({
  displayName: 'user',
  store: {
    userData: []
  },
  actions: {
    getUser: {
      async: true,
      reducer: {
        success: (store, action) => {
          store.userData = action.data
        }
      }
    }
  }
}, require('../resource/user'))
