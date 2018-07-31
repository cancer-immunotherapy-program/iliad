// Module imports.
import {showMessages} from './app_actions';
import {Exchange} from './exchange_actions';
import {
  fetchManifests,
  createManifest,
  updateManifest,
  destroyManifest,
  getConsignments,
  getConsignmentsByManifestId
} from '../api/manifests_api';

// Remove a manifest from the store.
const removeManifest = (id)=>({
  type: 'REMOVE_MANIFEST',
  id
});

// Add a manifest to the store.
const addManifest = (manifest)=>({
  type: 'ADD_MANIFEST',
  manifest
});

const editManifest = (manifest)=>({
  type: 'UPDATE_USER_MANIFEST',
  manifest
});

export const toggleManifestsFilter = (filter)=>({
  type: 'TOGGLE_MANIFESTS_FILTER',
  filter
});

export const selectManifest = (id)=>({
  type: 'SELECT_MANIFEST',
  id
});

/*
 * The md5sum of the manifest script is used as an id for the consignment.
 */
export const addConsignment = (md5sum, consignment)=>({
  type: 'ADD_CONSIGNMENT',
  md5sum,
  consignment
});

// Retrieve all user-visible manifests and send to store.
export const requestManifests = ()=>{
  return (dispatch)=>{

    let localSuccess = ({manifests})=>{
      if(manifests == null)return;
      for(let index in manifests) dispatch(addManifest(manifests[index]));
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
    };

    return fetchManifests(new Exchange(dispatch,'request-manifest'))
      .then(localSuccess)
      .catch(localError);
  };
};

// Delete a manifest from the database and the store.
export const deleteManifest = (manifest, success)=>{
  return (dispatch)=>{
    let localSuccess = (response)=>{
      dispatch(removeManifest(response.manifest.id));
      if (success != undefined) success(response);
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
    };

    let exchange = new Exchange(dispatch, 'delete-manifest')
    return destroyManifest(manifest.id, exchange)
      .then(localSuccess)
      .catch(localError);
  };
};

// Post to create new manifest and save in the store.
export const saveNewManifest = (manifest, success)=>{
  return (dispatch)=>{

    let localSuccess = (response)=>{
      dispatch(addManifest(response.manifest));
      if (success != undefined) success(response);
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
    };

    return createManifest(manifest, new Exchange(dispatch, 'save-new-manifest'))
      .then(localSuccess)
      .catch(localError);
  };
};

export const saveManifest = (manifest)=>{
  return (dispatch)=>{

    let localSuccess = (response)=>{
      dispatch(editManifest(response.manifest));
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
    };

    let exchange = new Exchange(dispatch, 'save-manifest');
    return updateManifest(manifest, manifest.id, exchange)
      .then(localSuccess)
      .catch(localError);
  };
};

export const copyManifest = (manifest, success)=>{
  return (dispatch)=>{

    let localSuccess = (response)=>{
      dispatch(addManifest(response.manifest));
      if(success != undefined) success(response);
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
    };

    let create_args = {...manifest, 'name': `${manifest.name}(copy)`};
    let exchange = new Exchange(dispatch, 'copy-manifest')
    return createManifest(create_args, exchange)
      .then(localSuccess)
      .catch(localError);
  };
};

const consignmentSuccess = (dispatch,success)=>{
  return (response)=>{
    for(let md5sum in response){
      dispatch(addConsignment(md5sum, response[md5sum]));
    }

    if(success != undefined) success(response);
  };
};

const consignmentError = (dispatch, error)=>{
  return (err)=>{

    let localResponse = (response)=>{

      if(response.query){
        dispatch(showMessages([response.error]));
      }
      else if(response.error){
        dispatch(showMessages([response.error]));
      }
      else if(response.errors){
        dispatch(showMessages(
          response.errors.map((error) => `* ${error}`).join('\n')
        ));
      }

      if(error != undefined) error(response);
    };

    if(err.response){
      err.response.json().then(localResponse);
    }
    else{
      throw err;
    }
  }
};

/*
 * Post a manifest to the query api and send the returned consignment to the
 * store. If things go wrong, show a message with the error.
 */
export const requestConsignments = (manifests, success, error)=>{
  return (dispatch)=>{
    let exchng = new Exchange(dispatch, 'consignment list');
    return getConsignments(manifests, exchng)
      .then(consignmentSuccess(dispatch,success))
      .catch(consignmentError(dispatch, error));
  };
};

export const requestConsignmentsByManifestId = (manifest_ids, record_name, success, error)=>{
  return (dispatch)=>{
    let exchng = new Exchange(dispatch, 'consignment list');
    return getConsignmentsByManifestId(manifest_ids, record_name, exchng)
      .then(consignmentSuccess(dispatch, success))
      .catch(consignmentError(dispatch, error));
  }
};

const showErrors = (err, dispatch)=>{
  if('response' in err){
    err.response
      .json()
      .then(json=>dispatch(showMessages([json.error])));
  }
  else{
    console.log(err);
  }
};
