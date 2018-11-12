import _ from 'lodash';
import qs from 'qs';
import flyd from 'flyd';
import wrapData from 'wrap-data';
import isPOJO from 'is-plain-obj';

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

function defaultCheckStatus(response) {
  if (response.status >= 200 && response.status < 300 || response.status == 304) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function defaultBeforeResponse(response) {
  return response.json();
}

function defaultAfterResponse(res) {
  if (res && res.errCode !== 0 && (!res.code || res.code !== 'SUCCESS')) {
    const err = new Error(res.message || res.toString());
    err.code = res.code || '接口错误';
    return err;
  } else {
    return res && res.data;
  }
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
              timeout,
              checkStatus,
              beforeResponse,
              afterResponse
            } = actions[service] || {};
            if (typeof exec == 'string') exec = model.unwrap(['api', name, exec], {
              map: v => v
            });
            if (!exec) exec = apiConfig;
            const {mock} = exec;
            // console.log(exec, reducer)
            const method = String(exec.method || 'get').toUpperCase();
            const hasBody = /PUT|POST|PATCH/.test(method);
            let url = replaceParams(exec.url, args.params);
            // query = {...param, ...query};
            if (!hasBody && !isEmpty(query)) {
              url = url + '?' + qs.stringify(query);
            }
            const controller = new AbortController();
            timeout = Number(timeout);
            let isTimeout = false;
            let timeoutId = -1;
            if (timeout > 0) {
              timeoutId = setTimeout(() => {
                isTimeout = true;
                controller.abort();
              }, timeout);
            }
            let init = {
              method,
              signal: controller.signal,
              credentials: 'same-origin',
              headers: window.ajaxHeader,
              ...exec,
              body: hasBody ? JSON.stringify(query) : undefined,
              ...args
            };
            let promise = mock ?
              Promise.resolve(mock instanceof Response || mock instanceof Promise ?
                mock :
                new Response(
                  isPOJO(mock) || Array.isArray(mock) ?
                    JSON.stringify(mock) :
                    mock
                )
              ) :
              abortableFetch(url, init);
            // console.error(url, init);
            return promise
              .then(r=>{
                clearTimeout(timeoutId)
                return r;
              })
              .then(checkStatus || defaultCheckStatus)
              .then(beforeResponse || defaultBeforeResponse)
              .then(res => {
                afterResponse = afterResponse || defaultAfterResponse;
                res = afterResponse(res);
                // console.log('res', res);
                const success = callback && callback.success || reducer && reducer.success || callback || reducer;
                if (success) {
                  success(store, {
                    data: res
                  });
                  model.change.emit(model.get(['store', name]), 'change');
                }
                return res;
              })
              .catch(err => {
                clearTimeout(timeoutId)
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


/**
 * Checks if a value is empty.
 */
export function isEmpty(value) {
  if (Array.isArray(value)) {
    return value.length === 0;
  } else if (typeof value === 'object') {
    if (value) {
      if (isIterable(value) && value.size !== undefined) {
        throw new Error('isEmpty() does not support iterable collections.');
      }
      for (const _ in value) {
        return false;
      }
    }
    return true;
  } else {
    return !value;
  }
}

export function isIterable(value) {
  if (typeof Symbol === 'undefined') {
    return false;
  }
  return value[Symbol.iterator];
}

export function pureMessage(id, msg) {
  return msg;
}
