import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetch from 'isomorphic-fetch';
import nock from 'nock';

// Fixtures for data mocking.
import {
  manifest_data,
  new_manifest_request,
  new_manifest_response
} from '../fixtures/manifest_fixture';

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
global.APP_CONFIG = {
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
ADD_PLOT when fetching a users manifests from the requestManifests action.`;

  it(long_str, ()=>{
    stub_url(
      `/${PROJECT_NAME}/manifests`,
      manifest_data,
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
        type: 'ADD_MANIFEST',
        manifest: manifest_data.manifests[0]
      },
      {
        type: 'ADD_MANIFEST',
        manifest: manifest_data.manifests[1]
      }
    ];

    let store = mockStore({});
    return store.dispatch(requestManifests()).then(()=>{
      expect(store.getActions()).toEqual(expected_actions);
    });
  });

  long_str = `creates ADD_EXCHANGE, REMOVE_EXCHANGE and REMOVE_MANIFEST when
deleting a user manifest from the deleteManifest action.`;

  it(long_str, ()=>{

    let id = manifest_data.manifests[0].id;

    stub_url(
      `/${PROJECT_NAME}/manifests/destroy/${id}`,
      {manifest: {id}},
      'delete'
    );

    let exchange_name = 'delete-manifest';
    let expected_actions = [
      {
        type: 'ADD_EXCHANGE',
        exchange_name,
        exchange:{
          exchange_name,
          exchange_path:`${url}${PROJECT_NAME}/manifests/destroy/${id}`,
          start_time: current_date
        }
      },
      {
        type: 'REMOVE_EXCHANGE',
        exchange_name
      },
      {
        type: 'REMOVE_MANIFEST',
        id
      }
    ];

    let store = mockStore({});
    return store.dispatch(deleteManifest(manifest_data.manifests[0])).then(()=>{
      expect(store.getActions()).toEqual(expected_actions);
    });
  });

  long_str = `creates ADD_EXCHANGE, REMOVE_EXCHANGE and ADD_MANIFEST when
creating a new user manifest from the saveNewManifest action.`;

  it(long_str, ()=>{
    stub_url(
      `/${PROJECT_NAME}/manifests/create`,
      {manifest: new_manifest_response},
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
        manifest: new_manifest_response
      }
    ];

    let store = mockStore({});
    return store.dispatch(saveNewManifest(new_manifest_request)).then(()=>{
      expect(store.getActions()).toEqual(expected_actions);
    });
  });

  long_str = `creates ADD_EXCHANGE, REMOVE_EXCHANGE, and UPDATE_USER_MANIFEST
when updating user manifest from the saveManifest action.`;

  it(long_str, ()=>{
    let id = manifest_data.manifests[0].id
    manifest_data.manifests[0].script = "@record_name = '1023'";

    stub_url(
      `/${PROJECT_NAME}/manifests/update/${id}`,
      {manifest: manifest_data.manifests[0]},
      'post'
    );

    let exchange_name = 'save-manifest';
    let expected_actions = [
      {
        type: 'ADD_EXCHANGE',
        exchange_name,
        exchange:{
          exchange_name,
          exchange_path:`${url}${PROJECT_NAME}/manifests/update/${id}`,
          start_time: current_date
        }
      },
      {
        type: 'REMOVE_EXCHANGE',
        exchange_name
      },
      {
        type: 'UPDATE_USER_MANIFEST',
        manifest: manifest_data.manifests[0]
      }
    ];

    let store = mockStore({});
    return store.dispatch(saveManifest(manifest_data.manifests[0])).then(()=>{
      expect(store.getActions()).toEqual(expected_actions);
    });
  });


  long_str = `creates ADD_EXCHANGE, REMOVE_EXCHANGE and ADD_MANIFEST when
copying a user manifest from the copyManifest action.`;

  it(long_str, ()=>{

    let manifest_copy = Object.assign({}, manifest_data.manifests[0], {
      id: 20,
      name: `${manifest_data.manifests[0]}(copy)`
    });

    stub_url(
      `/${PROJECT_NAME}/manifests/create`,
      {manifest: manifest_copy},
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
        manifest: manifest_copy
      }
    ];

    let store = mockStore({});

    return store.dispatch(copyManifest(manifest_data.manifests[0])).then(()=>{
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
