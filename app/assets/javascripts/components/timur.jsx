// Framework Libraries.
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

// Data Store.
import TimurModel from '../reducers/timur_model';

// Components.
import TimurNav from './timur_nav';
import Manifests from './manifest/manifests';
import Browser from './browser';
import ModelMap from './model_map';
import Plotter from './plotter';
import Search from './search/search';
import Activity from './activity';
import Noauth from './noauth';
import Messages from './messages';

class Timur{
  constructor(){
    this.model = null;
    this.createStore();
    this.buildUI();
  }

  createStore(){
    this.model = new TimurModel();
  }

  buildUI(){
    ReactDOM.render(
      <Provider store={this.model.store}>

        <div>

          {this.renderComponent()}
        </div>
      </Provider>,
      document.getElementById('ui-group')
    );
  }

  renderComponent(){
    var component = null;

    var browser_props = {
      'can_edit': CAN_EDIT,
      'model_name': MODEL_NAME,
      'record_name': RECORD_NAME
    };

    var search_props = {
      'can_edit': CAN_EDIT
    };

    var timur_nav_props = {
      'user': USER,
      'can_edit': CAN_EDIT,
      'mode': MODE,
      'environment': ENVIRONMENT,
    };

    var manifest_props = {
      'currentUser': USER,
      'isAdmin': IS_ADMIN,
    };

    switch(MODE){
      case 'manifests':
        component = <Manifests {...manifest_props} />;
        break;
      case 'browse':
        component = <Browser {...browser_props} />;
        break;
      case 'map':
        component = <ModelMap />;
        break;
      case 'plot':
        component = <Plotter />;
        break;
      case 'search':
        component = <Search  {...search_props} />; 
        break;
      case 'activity':
        component = <Activity activities={ACTIVITIES} />;
        break;
      case 'noauth':
        component = <Noauth user={USER} />;
        break;
      default:
        break;
    }

    return(
      <div id='ui-container'>

        <TimurNav {...timur_nav_props} />
        <Messages />
        {component}
      </div>
    );
  }
}

// Initilize the application.
const timur = new Timur();
