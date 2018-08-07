// Class imports.
import {Exchange} from './exchange_actions';

// Module imports.
import {requestDocuments} from './magma_actions';
import {getItem} from '../utils/cookies';
import {
  getView,
  updateView,
  deleteView
} from '../api/view_api';

const addTab = (view_name, tab_name, tab)=>{
  return {
    type: 'ADD_TAB',
    view_name, // The view name also references a Magma Model.
    tab_name,
    tab
  };
};

const addView = (view_name, view)=>{
  return {
    type: 'ADD_VIEW',
    view_name, // The view name also references a Magma Model.
    view
  };
};

const refreshViews = (views)=>{
  return {
    type: 'REFRESH_VIEWS',
    views
  };
};

// Flip a config variable.
export const toggleConfig = (key)=>{
  return {
    'type': 'TOGGLE_CONFIG',
    key
  };
};

export const addTokenUser = (user)=>{
  return {
    type: 'ADD_TOKEN_USER',
    token: getItem(APP_CONFIG.token_name)
  };
};

export const showMessages = (messages)=>{
  return {
    type: 'SHOW_MESSAGES',
    messages: messages
  };
};

export const dismissMessages = ()=>{
  return {
    type: 'DISMISS_MESSAGES'
  }
};

/*
 * Request a view for a given model/record/tab and send requests for additional
 * data.
 */
export const requestView = (model_nm, rec_nm, tab_nm, success, error)=>{
  return (dispatch)=>{
    // Handle success from 'getView'.
    let localSuccess = (response)=>{

      // Add the tab views to the store.
      Object.values(response.views[model_nm].tabs).forEach((tab)=>{
        dispatch(addTab(
          model_nm,
          tab.name,
          response.views[model_nm].tabs[tab.name]
        ));
      });

      if(success != undefined){
        success(response);
      }
    };

    // Handle an error from 'getView'.
    let localError = (e)=>{
      if(error != undefined) error(e);
    };

    /*
     * First, we pull the view file from the app server. This will contain a
     * a data object that reperesents the layout of the page.
     */
    let exchange = new Exchange(dispatch,`view for ${model_nm} ${rec_nm}`);
    return getView(model_nm, exchange)
      .then(localSuccess)
      .catch(localError);
  };
};

export const requestViewSettings = ()=>{
  return (dispatch)=>{
    let localSuccess = (response)=>{

      Object.keys(response.views).forEach((key)=>{
        dispatch(addView(key, response.views[key]));
      });
    };

    let localError = (err)=>{
      console.log(err);
    };

    let exchange = new Exchange(dispatch, 'view for settings');
    return getView('all', exchange)
      .then(localSuccess)
      .catch(localError);
  };
};

export const updateViewSettings = (view_obj)=>{
  return (dispatch)=>{
    let localSuccess = (response)=>{
      dispatch(refreshViews(response.views));
    };

    let localError = (err)=>{
      console.log(err);
    };

    let exchange = new Exchange(dispatch, 'updating view settings');
    return updateView(view_obj, exchange)
      .then(localSuccess)
      .catch(localError);
  };
};

export const deleteViewSettings = (view_obj)=>{
  return (dispatch)=>{
    let localSuccess = (response)=>{
      dispatch(refreshViews(response.views));
    };

    let localError = (err)=>{
      console.log(err);
    };

    let exchange = new Exchange(dispatch, 'delete view settings');
    return deleteView(view_obj, exchange)
      .then(localSuccess)
      .catch(localError);
  };
};
