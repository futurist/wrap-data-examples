import _ from 'lodash';
import flyd from 'flyd';

export function genAPI(model, res) {
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
