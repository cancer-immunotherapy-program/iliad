// Framework Libraries.
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';

import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';

// Reducers.
import magma from './reducers/magma_reducer';
import messages from './reducers/message_reducer';
import plots from './reducers/plots_reducer';
import app from './reducers/app_reducer';
import search from './reducers/search_reducer';
import manifestsUI from './reducers/manifest_ui_reducer';
import manifests from './reducers/manifests_reducer';
import consignments from './reducers/consignments_reducer';
import exchanges from './reducers/exchanges_reducer';
import predicates from './reducers/predicates_reducer';

// Components.
import {ManifestsContainer as Manifests} from './components/manifest/manifests';
import {BrowserContainer as Browser} from './components/browser/browser';
import {PlotterContainer as Plotter} from './components/plotter/plotter';
import {MessagesContainer as Messages} from './components/messages';
import {AppNavContainer as AppNav} from './components/general/app_nav';
import {HomePageContainer as HomePage} from './components/home_page';
import {Settings} from './components/settings/settings';

import ModelMap from './components/model_map';
import Search from './components/search/search';
import Activity from './components/activity';
import Noauth from './components/noauth';


class IliadApplication{
  constructor(initial_props, container_id){
    this.store = null;
    this.createStore();
    this.createUI(initial_props, container_id);
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
      messages: [],
      plots: {
        plotsMap: {},
        selected: null,
        selectedPoints: []
      },
      predicates: {},
      search: {
        pages: {}
      },
      app: {}
    };

    let reducers = Redux.combineReducers({
      magma,
      messages,
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
    if(process.env.NODE_ENV != 'production') middlewares.push(createLogger());

    this.store = Redux.createStore(
      reducers,
      default_state,
      Redux.applyMiddleware(...middlewares)
    );
  }

  createComponent(props){
    switch(props.mode){
      case 'home':
        return <HomePage {...props} />;
      case 'manifests':
        return <Manifests {...props} />;
      case 'browse':
        return <Browser {...props} />;
      case 'map':
        return <ModelMap />;
      case 'plots':
        return <Plotter {...props}/>;
      case 'search':
        return <Search  {...props} />;
      case 'settings':
        return <Settings {...props} />;
      case 'activity':
        return <Activity {...props} />;
      case 'noauth':
        return <Noauth {...props} />;
      default:
        return null;
    }
  }

  createUI(props, container_id){
    let app_nav_props = {
      user: props.user,
      can_edit: props.can_edit,
      mode: props.mode,
      environment: props.environment
    };

    ReactDOM.render(
      <Provider store={this.store}>

        <div id='ui-container'>

          <AppNav {...app_nav_props} />
          <Messages />
          {this.createComponent(props)}
        </div>
      </Provider>,
      document.getElementById(container_id)
    );
  }
}

window.IliadApp = IliadApplication;
