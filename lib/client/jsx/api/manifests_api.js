// Module imports.
import {
  headers,
  parseJSON,
  checkStatus
} from '../utils/fetch_utils';

export const fetchManifests = (exchange)=>{
  let route_opts = {
    credentials: 'same-origin',
    method: 'GET',
    headers: headers('json', 'csrf')
  };

  let uri = Routes.manifests_fetch_path(APP_CONFIG.project_name);
  return exchange.fetch(uri, route_opts)
    .then(checkStatus)
    .then(parseJSON);
};

export const createManifest = (manifest, exchange)=>{
  let route_opts = {
    credentials: 'same-origin',
    method: 'POST',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(manifest)
  };

  let uri = Routes.manifests_create_path(APP_CONFIG.project_name);
  return exchange.fetch(uri, route_opts)
    .then(checkStatus)
    .then(parseJSON);
};

export const updateManifest = (manifestUpdates, manifest_id, exchange)=>{
  let route_opts = {
    credentials: 'same-origin',
    method: 'POST',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(manifestUpdates)
  };

  let uri = Routes.manifests_update_path(
    APP_CONFIG.project_name,
    manifest_id
  );

  return exchange.fetch(uri, route_opts)
    .then(checkStatus)
    .then(parseJSON);
};

export const destroyManifest = (manifest_id, exchange)=>{
  let route_opts = {
    credentials: 'same-origin',
    method: 'DELETE',
    headers: headers('json', 'csrf')
  };

  let uri = Routes.manifests_destroy_path(
    APP_CONFIG.project_name,
    manifest_id
  );

  return exchange.fetch(uri, route_opts)
    .then(checkStatus)
    .then(parseJSON);
};

export const getConsignments = (manifests, exchange)=>{
  let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    body: JSON.stringify({queries: manifests.map(m=>m.script)})
  };

  let uri = Routes.consignment_path(APP_CONFIG.project_name);
  return exchange.fetch(uri, route_opts)
    .then(checkStatus)
    .then(parseJSON);
};

export const getConsignmentsByManifestId = (manifest_ids, record_name, exchange)=>{
  let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    body: JSON.stringify({manifest_ids, record_name})
  };

  let uri = Routes.consignment_path(APP_CONFIG.project_name);
  return exchange.fetch(uri, route_opts)
    .then(checkStatus)
    .then(parseJSON);
};
