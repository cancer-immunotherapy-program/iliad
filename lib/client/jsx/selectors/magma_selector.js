import * as Reselect from 'reselect';

// This function serves as an extention to the argument list of 'selectModel'.
const setRecordName = (state, project_name, model_name, record_name)=>{
  return (record_name != undefined || record_name != null) ? record_name : '';
};

// This function serves as an extention to the argument list of 'selectModel'.
const setRecordNames = (state, project_name, model_name, record_names)=>{
  return(record_names != undefined || record_names != null) ? record_names : [];
};

const selectModel = (state, project_name, model_name)=>{
  if(!(project_name in state.magma)) return {};
  if(!('models' in state.magma[project_name])) return {};
  if(!(model_name in state.magma[project_name].models)) return {};
  return state.magma[project_name].models[model_name];
};

export const selectModels = (state, project_name)=>{
  return (project_name in state.magma) ? state.magma[project_name].models : {};
};

/*
 * When a model references a dictionary we can extract the dictionary here. If
 * you have the dictionary name you can use the generic 'selectModel' function.
 * e.g. selectModel(state, 'dictionary', 'dictionary_name');
 */
export const selectDictionaryByModel = (state, project_name, model_name)=>{
  let model = selectModel(state, project_name, model_name);
  if(Object.keys(model).length == 0) return {};
  if(!('dictionary' in model.template)) return {};

  let dictionary = selectModel(
    state,
    model.template.dictionary.project,
    model.template.dictionary.name
  );

  if(Object.keys(dictionary).length == 0) return {};

  return {
    project: project_name,
    name: model_name,
    definitions: dictionary.documents
  };
}

/*
 * Select documents for a model by record names/ids. The names should be in an
 * array.
 */
export const selectModelDocuments = Reselect.createSelector(
  selectModel,
  setRecordNames,
  (model, record_names)=>{

    let docs = {};
    if('documents' in model){
      record_names.forEach((record_name)=>{
        if(record_name in model.documents){
          docs[record_name] = Object.assign({}, model.documents[record_name]);
        }
      });
    }

    return docs;
  }
);

export const selectModelRevisions = Reselect.createSelector(
  selectModel,
  (model)=>{

    /*
     * When we initialy have a revision we create a new data object which is
     * returned properly. When we remove a revision, we only delete the named
     * record within the revision data object. But we do not remove or replace
     * the revision data object. Since the selector sees the same data object it
     * does not recalculate and hands back the old revision data. In the reducer
     * the revision data should have been removed.
     */
    if('revisions' in model && Object.keys(model.revisions).length > 0){
      return model.revisions;
    }

    return {};
  }
);

export const selectModelRevision = Reselect.createSelector(
  selectModelRevisions,
  setRecordName,
  (revisions, record_name)=>{
    return (record_name in revisions) ? revisions[record_name] : {};
  }
);

// Select the model all the names from all of the models for a single project.
export const selectModelNames = Reselect.createSelector(
  selectModels,
  (models)=>{
    return Object.keys(models).sort();
  }
);

// Select all the templates for all the models for a single project.
export const selectModelTemplates = Reselect.createSelector(
  selectModels,
  (models)=>{
    return Object.keys(models).map((model_name)=>{
      return models[model_name].template;
    });
  }
);

// Select the template for a model.
export const selectModelTemplate = Reselect.createSelector(
  selectModel,
  (model)=>{
    return ('template' in model) ? model.template : null;
  }
);
