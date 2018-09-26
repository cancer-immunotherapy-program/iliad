// Framework Libraries.
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';

import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {addTokenUser} from './actions/app_actions';

// Reducers.
import magma from './reducers/magma_reducer';
import plots from './reducers/plots_reducer';
import app from './reducers/app_reducer';
import search from './reducers/search_reducer';
import manifestsUI from './reducers/manifest_ui_reducer';
import manifests from './reducers/manifests_reducer';
import consignments from './reducers/consignments_reducer';
import exchanges from './reducers/exchanges_reducer';
import predicates from './reducers/predicates_reducer';

// Components.
import {MessengerContainer as Messenger} from './components/general/messenger';
import {AppNavContainer as AppNav} from './components/general/app_nav';
import {ManifestsContainer as Manifests} from './components/manifest/manifests';
import {BrowserContainer as Browser} from './components/browser/browser';
import {PlotterContainer as Plotter} from './components/plotter/plotter';
import {HomePageContainer as HomePage} from './components/home_page';
import {SettingsContainer as Settings} from './components/settings/settings';
import {SearchContainer as Search} from './components/search/search';

import ModelMap from './components/model_map/model_map';

class IliadApplication{
  constructor(){
    this.store = null;
    this.createStore();
    this.store.dispatch(addTokenUser());
    this.parsePath();
    this.createUI();
  }

  createStore(){

    let default_state = {
      consignments: {},
      exchanges: {},
      magma: {},
      manifestsUI: {
        filter: null,
        selected: null
      },
      manifests: {},
      plots: {
        plotsMap: {},
        selected: null,
        selectedPoints: []
      },
      predicates: {},
      search: {
        pages: {}
      },
      app: {
        messages: []
      }
    };

    let reducers = Redux.combineReducers({
      magma,
      plots,
      app,
      search,
      manifestsUI,
      manifests,
      consignments,
      exchanges,
      predicates
    });

    let middlewares = [
      thunk
    ];

    // Apply the logging if we are not in production.
    //if(process.env.NODE_ENV != 'production') middlewares.push(createLogger());

    this.store = Redux.createStore(
      reducers,
      default_state,
      Redux.applyMiddleware(...middlewares)
    );
  }

  parsePath(){
    // Pull the URL.
    let parser = document.createElement('a');
    parser.href = window.location.href;

    // Split and compact the path.
    let path = [];
    if(parser.pathname){
      path = parser.pathname
        .split('/')
        .filter((item)=>((item) ? true : false)); // Compact.
    }

    // Hash the path parts.
    if(path.length > 0){
      path = {
        project: path[0] ? path[0] : null,
        component: path[1] ? path[1] : null,
        model: path[2] ? path[2] : null,
        record: path[3] ? decodeURIComponent(path[3]) : null
      };

      // Set the path on the store.
      this.store.dispatch({
        type: 'SET_PATH',
        path
      });
    }
  }

    createComponent(){
    // Extract the component portion of the path out of the store.
    let state = this.store.getState();
    let component = (state.app.path) ? state.app.path.component : '';

    switch(component){
      case '':
        return <HomePage />;
      case 'manifests':
        return <Manifests />;
      case 'browse':
        return <Browser />;
      case 'map':
        return <ModelMap />;
      case 'plots':
        return <Plotter />;
      case 'search':
        return <Search />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  }

  createUI(){
    ReactDOM.render(
      <Provider store={this.store}>

        <div id='ui-container'>

          <AppNav />
          <Messenger />
          {this.createComponent()}
        </div>
      </Provider>,
      document.getElementById('root-container')
    );
  }
}

window.IliadApp = IliadApplication;
