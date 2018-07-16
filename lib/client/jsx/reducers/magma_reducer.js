/*
 * Below is a general structure of the Magma data store in Redux.
 *
 *  models: {
 *
 *    // This is a project grouping for Magma models.
 *    project_1: {
 *
 *      model_1: {
 *
 *        // This is a json document describing a Magma model.
 *        template: {},
 *
 *        // This is a json document describing a Magma record.
 *        documents: {
 *          
 *          document_name1: {
 *
 *            attribute1: value1
 *          }
 *        }
 *      },
 *      model_2: {
 *        etc...
 *      }
 *    }
 *  }
 */

let documents = function(old_documents, action){
  if (!old_documents)old_documents = {};

  switch(action.type){
    case 'ADD_DOCUMENTS':

      let documents = {
        ...old_documents,
      };

      for(let record_name in action.documents){
        documents[record_name] = {
          ...documents[record_name],
          ...action.documents[record_name]
        };
      }

      return documents;
    default:
      return old_documents;
  }
};

let revisions = function(old_revisions, action){
  if (!old_revisions) old_revisions = {};
  switch(action.type){
    case 'REVISE_DOCUMENT':
      return {
        ...old_revisions,
        [action.record_name]: {
          ...old_revisions[action.record_name],
          ...action.revision
        }
      };
    case 'DISCARD_REVISION':
      delete old_revisions[action.record_name];
      return old_revisions;
    default:
      return old_revisions;
  }
};

let model = function(old_model, action){

  if(!old_model){
    old_model = {
      documents: {},
      revisions: {},
      template: {}
    };
  }

  switch(action.type){
    case 'ADD_TEMPLATE':
      return {
        ...old_model,
        template: action.template
      };
    case 'ADD_DOCUMENTS':
      return { 
        ...old_model,
        documents: documents(old_model.documents, action)
      };
    case 'REVISE_DOCUMENT':
    case 'DISCARD_REVISION':
      return {
        ...old_model,
        revisions: revisions(old_model.revisions, action)
      };
    default:
      return old_model;
  }
};

let models = function(old_models, action){
  if (!old_models) old_models = {};
  switch(action.type) {
    case 'ADD_TEMPLATE':
    case 'ADD_DOCUMENTS':
    case 'REVISE_DOCUMENT':
    case 'DISCARD_REVISION':
      return {
        ...old_models,
        [action.model_name]: model(old_models[action.model_name], action)
      };
    default:
      return models;
  }
}

let magmaReducer = function(magma, action){
  if(!magma) magma = {};

  switch(action.type){
    case 'ADD_TEMPLATE':
    case 'ADD_DOCUMENTS':
    case 'REVISE_DOCUMENT':
    case 'DISCARD_REVISION':

      if('project_name' in action){

        // Select the old models if they exist.
        let old_models = {};
        if(action.project_name in magma){
          if('models' in magma[action.project_name]){
            old_models = magma[action.project_name].models;
          }
        }

        return {
          ...magma,
          [action.project_name]: {
            models: models(old_models, action)
          }
        };
      }

      return magma;
    default:
      return magma;
  }
};

export default magmaReducer;
