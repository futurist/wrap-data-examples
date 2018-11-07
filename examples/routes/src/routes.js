import wrapper from './scene/wrapper'
import People from './scene/people'
import Cars from './scene/cars'
import Bus from './scene/cars/bus'

export default [{
  path: '/',
  component: wrapper,
  modelName: 'company',
  childRoutes: [{
      path: 'car',
      component: Cars,
      modelName: 'car',
      childRoutes: [{
        path: 'bus',
        component: Bus,
        modelName: 'bus',
      }]
    },
    {
      path: 'people',
      component: People,
    },
  ]
}];
