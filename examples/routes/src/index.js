
import React from 'react'
import { render } from 'react-dom'
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom'
import _ from 'lodash'
import routes from './routes'
import model from './model'

function getAPIFromRoute({api}) {
  if(!Array.isArray(api)) return
  const props = {}
  api.forEach((name)=>{
    const services = {}
    props[name] = services
    _.forEach(model.unwrap(['api', name]), (val,key)=>{
      services[key] = model.unwrap(['api', name, key])
    })
  })
  return props
}

function joinPath(prev, url) {
  prev = prev || ''
  if(url[0]!='/') url = '/' + url;
  if(prev[prev.length-1]=='/') prev = prev.slice(0, -1)
  return prev + url;
}

function RouteWithSubRoutes(route) {
  const {model, modelName} = route
  let subModule = model
  if(modelName) {
    model.ensure(modelName, {})
    subModule = model.slice(modelName)
  }
  return (
    <Route
      path={route.path}
      render={props => (
        // pass the sub-routes down to keep nesting
        <route.component
          {...props}
          routeParams={props.match.params||{}}
          {...getAPIFromRoute(route)}
          model={subModule}
        >
          <Switch>
            {
              route.childRoutes && route.childRoutes.map((childRoute, i) => {
                const path = joinPath(route.path, childRoute.path)
                console.log(path)
                return <RouteWithSubRoutes key={i} {...childRoute} path={path} model={subModule} />
              })
            }
          </Switch>
        </route.component>
      )}
    />
  );
}

class App extends React.Component {
  render() {
    return <Router>
      <Switch>
        {
          routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} model={model} />
          ))
        }
      </Switch>
    </Router>
  }
}

render(<App />, document.getElementById('app'));
