// Class imports.
import {Exchange} from './exchange_actions';

// Module imports.
import downloadjs from 'downloadjs'
import {requestDocuments} from './magma_actions';
import {getAttributes} from '../selectors/tab_selector';
import {getItem} from '../utils/cookies';

import {
  getView,
  updateView,
  deleteView
} from '../api/view_api';

import {
  selectModelDocuments,
  selectModelTemplate,
  selectDictionaryByModel
} from '../selectors/magma_selector';

import {
  nestDataset,
  setDefinitionUids,
  setSiblingUids,
  flattenDataSet
} from '../selectors/selector_utils.js';


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

      let tab;
      if(response.views[model_nm].tabs[tab_nm] == null){
        tab = response.views[model_nm].tabs['default'];
      }
      else{
        tab = response.views[model_nm].tabs[tab_nm];
      }

      // Request the documents needed to populate this 'tab'.
      let exchange_name = `tab ${tab_nm} for ${model_nm} ${rec_nm}`;
      dispatch(
        requestDocuments({
          model_name: model_nm,
          exchange_name,
          record_names: [rec_nm],
          attribute_names: getAttributes(tab)
        })
      );

       // Add the tab views to the store.
      for(let tab_name in response.views[model_nm].tabs){
        let action = addTab(
          model_nm, // Model name is also the view name.
          tab_name,
          response.views[model_nm].tabs[tab_name]
        );
        dispatch(action);
      }

      if(success != undefined) success();
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

export const requestDownload = (store, model_name, tab)=>{
  let process_nested = (store, attr_name)=>{
    let nested_data = nestDataset(
      selectModelDocuments(store, APP_CONFIG.project_name, attr_name, 'all'),
      'uid',
      'parent_uid'
    );

    let flattened_data = null;
    if(attr_name == 'demographic'){
      flattened_data = {};
      for(let key in nested_data){
        flattened_data = Object.assign(
          flattened_data,
          flattenDataSet(nested_data[key])
        );
      }
    }
    else{
      flattened_data = [];
      for(let key in nested_data){
        flattened_data.push(flattenDataSet(nested_data[key]));
      }
    }

    return flattened_data;
  };

  let extract_table_headers = (template)=>{
    return Object.keys(template.attributes).filter((attr_name)=>{
      let attr = template.attributes[attr_name];
      return (attr.shown && attr.attribute_class != 'Magma::TableAttribute');
    });
  };

  let set_csv_data = (table_headers, records)=>{
    let table_data = [];
    Object.keys(records).forEach((record_key)=>{
      let table_row = table_headers.map((header)=>{
        return records[record_key][header];
      });

      table_data.push(table_row.join(','));
    });

    return table_data.join('\n');
  };

  return (dispatch)=>{

    // Extract attributes from tab.
    let attributes = [];
    Object.keys(tab.panes).forEach((pane_name)=>{
      Object.keys(tab.panes[pane_name].attributes).map((attr_name)=>{
         attributes.push(tab.panes[pane_name].attributes[attr_name]);
      });
    });

    let download_data = '';
    attributes.forEach((attr)=>{
      switch(attr.attribute_class){
        case 'ClinicalAttribute':

          download_data += JSON.stringify(
            {[attr.name]: process_nested(store, attr.name)},
            null,
            2
          );
          download_data += '\n\n';

          break;
        case 'Magma::TableAttribute':

          let args = [store, APP_CONFIG.project_name, attr.name];
          let records = selectModelDocuments(...[...args, 'all']);

          if(Object.keys(records).length <= 0) break;

          let template = selectModelTemplate(...args);
          let table_headers = (template) ? extract_table_headers(template): [];

          download_data += `${table_headers.join(',')}\n`;
          download_data += set_csv_data(table_headers, records);
          download_data += '\n\n';

          break;
        default:
          break;
      }
    })

    downloadjs(download_data, model_name+'.txt', 'text/plain');
  }
}
