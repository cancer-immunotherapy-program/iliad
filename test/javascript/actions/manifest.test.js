import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetch from 'isomorphic-fetch';
import nock from 'nock';

// Fixtures for data mocking.
import {manifest_response} from '../fixtures/manifest_response';

import {
  all_manifest_response,
  plot
} from '../fixtures/all_manifests_response';

import {
  manifest_store,
  manifest
} from '../fixtures/manifests_store';

// Actions to test.
import {
  requestManifests,
  deleteManifest,
  saveNewManifest,
  saveManifest,
  copyManifest
} from '../../../lib/client/jsx/actions/manifest_actions';

/*
 * Pre test setup.
 */

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const PROJECT_NAME = 'labors';
const url = 'http://www.fake.com/';
const current_date = new Date();

const stub_url = (path, response, verb)=>{
  nock(url)[verb](path)
    .reply(
      200,
      response,
      {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/json'
      }
    );
};

global.fetch = fetch;
global.Date = jest.fn(() => current_date);
global.TIMUR_CONFIG = {
  project_name: PROJECT_NAME
};

global.Routes = {
  manifests_fetch_path: (project_name)=>{
    return `${url}${project_name}/manifests`;
  },
  manifests_destroy_path: (project_name, manifest_id)=>{
    return `${url}${project_name}/manifests/destroy/${manifest_id}`;
  },
  manifests_create_path: (project_name)=>{
    return `${url}${project_name}/manifests/create`;
  },
  manifests_update_path: (project_name, manifest_id)=>{
    return `${url}${project_name}/manifests/update/${manifest_id}`;
  }
};

/*
 * Unit tests for manifest_actions.js.
 */

describe('async actions', ()=>{
  afterEach(()=>{
    nock.cleanAll();
  });

  let long_str = '';

  long_str = `creates ADD_EXCHANGE, REMOVE_EXCHANGE, LOAD_MANIFESTS, and 
ADD_PLOT when fetching user manifests has been done`;

  it(long_str, ()=>{
    stub_url(
      `/${PROJECT_NAME}/manifests`,
      all_manifest_response,
      'get'
    );

    let exchange_name = 'request-manifest';

    let expected_actions = [
      {
        type: 'ADD_EXCHANGE',
        exchange_name,
        exchange:{
          exchange_name,
          exchange_path: `${url}${PROJECT_NAME}/manifests`,
          start_time: current_date
        }
      },
      {
        type: 'REMOVE_EXCHANGE',
        exchange_name
      },
      {
        type: 'LOAD_MANIFESTS',
        manifests_by_id: manifest_store
      }
    ];

    let store = mockStore({manifests: manifest_store});

    return store.dispatch(requestManifests()).then(()=>{
      expect(store.getActions()).toEqual(expected_actions);
    });
  });

  long_str = `creates ADD_EXCHANGE, REMOVE_EXCHANGE and REMOVE_MANIFEST when
deleting a user manifest has been done`;

  it(long_str, ()=>{
    let manifest = {id: 1};

    stub_url(
      `/${PROJECT_NAME}/manifests/destroy/${manifest.id}`,
      {manifest},
      'delete'
    );

    let exchange_name = 'delete-manifest';

    let expected_actions = [
      {
        type: 'ADD_EXCHANGE',
        exchange_name,
        exchange:{
          exchange_name,
          exchange_path:`${url}${PROJECT_NAME}/manifests/destroy/${manifest.id}`,
          start_time: current_date
        }
      },
      {
        type: 'REMOVE_EXCHANGE',
        exchange_name
      },
      {
        type: 'REMOVE_MANIFEST',
        id: manifest.id
      }
    ];

    let store = mockStore({});

    return store.dispatch(deleteManifest(manifest)).then(()=>{
      expect(store.getActions()).toEqual(expected_actions);
    });
  });

  long_str = `creates ADD_EXCHANGE, REMOVE_EXCHANGE and ADD_MANIFEST when
creating a new user manifest has been done`;

  it(long_str, ()=>{
    stub_url(
      `/${PROJECT_NAME}/manifests/create`,
      manifest_response,
      'post'
    );

    let exchange_name = 'save-new-manifest';

    let expected_actions = [
      {
        type:'ADD_EXCHANGE',
        exchange_name,
        exchange:{
          exchange_name,
          exchange_path: `${url}${PROJECT_NAME}/manifests/create`,
          start_time: current_date
        }
      },
      {
        type: 'REMOVE_EXCHANGE',
        exchange_name
      },
      {
        type: 'ADD_MANIFEST',
        ...manifest_response
      }
    ];

    let store = mockStore({});

    return store.dispatch(saveNewManifest(manifest)).then(() => {
      expect(store.getActions()).toEqual(expected_actions);
    });
  });

  long_str = `creates ADD_EXCHANGE, REMOVE_EXCHANGE, and UPDATE_USER_MANIFEST
when updating user manifest has been done`;

  it(long_str, ()=>{
    let mani_id = manifest_response.manifest.id

    stub_url(
      `/${PROJECT_NAME}/manifests/update/${mani_id}`,
      manifest_response,
      'post'
    );

    let exchange_name = 'save-manifest';

    let expected_actions = [
      {
        type: 'ADD_EXCHANGE',
        exchange_name,
        exchange:{
          exchange_name,
          exchange_path:`${url}${PROJECT_NAME}/manifests/update/${mani_id}`,
          start_time: current_date
        }
      },
      {
        type: 'REMOVE_EXCHANGE',
        exchange_name
      },
      {
        type: 'UPDATE_USER_MANIFEST',
        ...manifest_response
      }
    ];

    let store = mockStore({});
    let mani_resp = {...manifest_response.manifest};
    return store.dispatch(saveManifest(mani_resp)).then(()=>{
      expect(store.getActions()).toEqual(expected_actions);
    });
  });

  long_str = `creates ADD_EXCHANGE, REMOVE_EXCHANGE and ADD_MANIFEST when
copying a user manifest has been done`;

  it(long_str, ()=>{
    let new_manifest_id =  manifest_response.manifest.id + 1;

    let copied_manifest_response = {
      ...manifest_response.manifest,
      name: `${manifest_response.manifest.name}(copy)`,
      id: new_manifest_id
    };

    stub_url(
      `/${PROJECT_NAME}/manifests/create`,
      {manifest: copied_manifest_response},
      'post'
    );

    let exchange_name = 'copy-manifest';

    let expectedActions = [
      {
        type: 'ADD_EXCHANGE',
        exchange_name,
        exchange:{
          exchange_name,
          exchange_path: `${url}${PROJECT_NAME}/manifests/create`,
          start_time: current_date
        }
      },
      {
        type: 'REMOVE_EXCHANGE',
        exchange_name
      },
      {
        type: 'ADD_MANIFEST',
        manifest: copied_manifest_response
      }
    ];

    let store = mockStore({});

    return store.dispatch(copyManifest(manifest_response.manifest)).then(()=>{
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
