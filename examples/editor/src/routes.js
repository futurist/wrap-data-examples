import wrapper from './scene/wrapper'

export default [{
  path: '/',
  component: wrapper,
  modelName: 'company',
  childRoutes: [{
      path: 'car',
      component: wrapper,
    },
  ]
}];
