import _ from 'lodash';
import qs from 'qs';
import flyd from 'flyd';
import wrapData from 'wrap-data';

import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import {fetch} from 'whatwg-fetch';
// use native browser implementation if it supports aborting
const abortableFetch = ('signal' in new Request('')) ? window.fetch : fetch;

function replaceParams(url, params = {}) {
  for (let key in params) {
    url = url.replace(':' + key, params[key]);
  }
  return url;
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

export function makeAPI(model, res) {
  return data => {
    data = data || {};
    data.store = data.store || {};
    data.actions = data.actions || {};
    data.api = data.api || {};
    data.store[model.displayName] = flyd.stream(model.store);
    data.actions[model.displayName] = flyd.stream(model.actions);
    _.forEach(res, (value, key) => {
      _.set(data.api, [model.displayName, key], value);
    });
    return data;
  };
}

export function makeModel(data, config) {
  return wrapData(
    flyd.stream,
    {
      unwrap: unwrapAPI,
      ...config
    }
  )(data);
}

export function unwrapAPI(packer) {
  if (!packer) return;
  // console.log(obj.path)
  const {
    path,
    root
  } = packer;
  const model = root;
  const [prefix, name, service] = path;
  if (prefix == 'api' && path.length === 3) {
    return {
      map: (apiConfig) => {
        return (query, args = {}) => Promise.resolve(typeof apiConfig == 'function' ? apiConfig() : apiConfig)
          .then(apiConfig => {
            const actions = model.unwrap(['actions', name]);
            const store = model.unwrap(['store', name]);
            let {
              exec,
              reducer,
              callback,
              mock,
              timeout
            } = actions[service] || {};
            if (typeof exec == 'string') exec = model.unwrap(['api', name, exec], {
              map: v => v
            });
            if (!exec) exec = apiConfig;
            // console.log(exec, reducer)
            if (mock) return Promise.resolve(mock);
            const method = String(exec.method || 'get').toUpperCase();
            const hasBody = /PUT|POST|PATCH/.test(method);
            let url = replaceParams(exec.url, args.params);
            if (!hasBody && query) {
              url = url + '?' + qs.stringify(query);
            }
            const controller = new AbortController();
            timeout = Number(timeout);
            let isTimeout = false;
            if (timeout > 0) {
              setTimeout(() => {
                isTimeout = true;
                controller.abort();
              }, timeout);
            }
            return abortableFetch(
              url, {
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
                  console.log('request aborted', isTimeout);
                }
                console.log(err);
                throw err;
              });
          });
      }
    };
  }
}

export function pureMessage(id, msg) {
  return msg;
}
