import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import {fetch} from 'whatwg-fetch'
// use native browser implementation if it supports aborting
const abortableFetch = ('signal' in new Request('')) ? window.fetch : fetch

import qs from 'qs'
import flyd from 'flyd'
import wrapData from 'wrap-data'

import _ from 'lodash'
import userData from './model/user'

const data = {}
userData(data)

function replaceParams(url, params = {}) {
  for (let key in params) {
    url = url.replace(':' + key, params[key]);
  }
  return url;
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON(response) {
  return response.json()
}

const model = wrapData(
  flyd.stream,
  {
    unwrap: packer => {
      if (!packer) return;
      // console.log(obj.path)
      const {path} = packer;
      const [prefix, name, service] = path;
      if (prefix == 'api' && path.length === 3) {
        return {
          map: (apiConfig) => {
            return (query, args = {}) => Promise.resolve(typeof apiConfig == 'function' ? apiConfig() : apiConfig)
              .then(apiConfig => {
                const actions = model.unwrap(['actions', name]);
                const store = model.unwrap(['store', name]);
                let {exec, reducer, callback, mock} = actions[service] || {};
                if (typeof exec == 'string') exec = model.unwrap(['api', name, exec], {map: v => v});
                if(!exec) exec = apiConfig
                // console.log(exec, reducer)
                if(mock) return Promise.resolve(mock)
                const method = String(exec.method||'get').toUpperCase()
                const hasBody = /PUT|POST|PATCH/.test(method)
                let url = replaceParams(exec.url, args.params)
                if(!hasBody && query) {
                  url = url + '?' + qs.stringify(query)
                }
                const controller = new AbortController()
                return abortableFetch(
                    url,
                    {
                      signal: controller.signal,
                      credentials: 'same-origin',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      ...exec,
                      body: hasBody ? JSON.stringify(query) : undefined,
                      ...args
                    }
                  )
                  .then(checkStatus)
                  .then(parseJSON)
                  .then(res => {
                    const success = callback && callback.success || reducer && reducer.success || callback || reducer;
                    if (success) {
                      success(store, {
                        data: res
                      });
                    }
                    model.change.emit(model.get(['store', name]), 'change');

                    if (res && res.errCode !== 0 && (!res.code || res.code !== 'SUCCESS')) {
                      const err = new Error(res.message || res.toString());
                      err.code = res.code || '接口错误';
                      return err;
                    } else {
                      return res && res.data;
                    }
                  })
                  .catch(err => {
                    if (err.name === 'AbortError') {
                      console.log('request aborted')
                    }
                    console.log(err);
                    throw err;
                  });
              });
          }
        };
      }
    }
  }
)(data);

window.model = model;
export default model;

