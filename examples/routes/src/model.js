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
                let {exec = apiConfig, reducer, callback, mock} = actions[service] || {};
                if (typeof exec == 'string') exec = model.unwrap(['api', name, exec], {map: v => v});
                // console.log(exec, reducer)
                if(mock) return Promise.resolve(mock)
                return fetch(replaceParams(apiConfig.url, args.params) + '?' + qs.stringify(query), {...apiConfig, ...args})
                  .then(r => r.json())
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

