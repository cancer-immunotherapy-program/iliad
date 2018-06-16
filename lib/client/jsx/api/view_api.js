// Module imports.
import {headers, parseJSON, checkStatus} from '../utils/fetch_utils';

export const getView = (model_name, tab_name, exchange)=>{
  let route_opts = {
    method: 'GET',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
  };

  let uri = Routes.view_path(TIMUR_CONFIG.project_name, model_name);
  let exchangePromise = exchange.fetch(uri, route_opts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const getUser = (exchange)=>{
  let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json', 'csrf')
  };

  let uri = Routes.settings_user_json_path();
  let exchangePromise = exchange.fetch(uri, route_opts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const updateView = (view_obj, exchange)=>{
  let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(view_obj)
  };

  let uri = Routes.update_view_json_path(TIMUR_CONFIG.project_name);
  let exchangePromise = exchange.fetch(uri, route_opts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const deleteView = (view_obj, exchange)=>{
    let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(view_obj)
  };

  let uri = Routes.delete_view_json_path(TIMUR_CONFIG.project_name);
  let exchangePromise = exchange.fetch(uri, route_opts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};
