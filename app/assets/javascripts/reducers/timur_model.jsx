import * as Redux from 'redux';
import thunk from 'redux-thunk';

import timurReducer from './timur_reducer';
import magmaReducer from './magma_reducer';
import messageReducer from './message_reducer';
import plotReducer from './plot_reducer';
import {filter, selected, isEditing} from './manifest_ui_reducer';
import manifestsReducer from './manifests_reducer';
import consignmentsReducer from './consignments_reducer';
import exchangesReducer from './exchanges_reducer';

export default class TimurModel{
  constructor(){
    var reducer = Redux.combineReducers({
      timur: timurReducer,
      magma: magmaReducer,
      messages: messageReducer,
      plots: plotReducer,
      filter: filter,
      selected: selected,
      isEditing: isEditing,
      manifests: manifestsReducer,
      consignments: consignmentsReducer,
      exchanges: exchangesReducer
    });

    var default_state = {
      timur: {},
      magma: {
        models: {},
        tables: {}
      },
      messages: {},
      plots: {},
      filter: null,
      selected: null,
      isEditing: false,
      manifests: {},
      consignments: {},
      exchanges: {}
    };

    this.store = Redux.createStore(
      reducer,
      default_state,
      Redux.applyMiddleware(thunk)
    );
  }
}
