import { headers, parseJSON, checkStatus } from './fetch_utils'

export const fetchManifests = (exchange)=>{
  let routeOpts = {
    credentials: 'same-origin',
    method: 'POST',
    headers: headers('json', 'csrf')
  };

  var exchangePromise = exchange.fetch('/'+PROJECT_NAME+'/manifests/fetch', routeOpts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const createManifest = (manifest, exchange)=>{
  let routeOpts = {
    credentials: 'same-origin',
    method: 'POST',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(manifest)
  };

  var exchangePromise = exchange.fetch('/'+PROJECT_NAME+'/manifests/create', routeOpts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const updateManifest = (manifestUpdates, manifestId, exchange)=>{
  let routeOpts = {
    credentials: 'same-origin',
    method: 'POST',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(manifestUpdates)
  };

  var exchangePromise = exchange.fetch('/'+PROJECT_NAME+'/manifests/update/'+manifestId, routeOpts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const destroyManifest = (manifestId, exchange)=>{
  let routeOpts = {
    credentials: 'same-origin',
    method: 'POST',
    headers: headers('json', 'csrf')
  };

  var exchangePromise = exchange.fetch('/'+PROJECT_NAME+'/manifests/destroy/'+manifestId, routeOpts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};
