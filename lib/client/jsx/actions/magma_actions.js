import {showMessages} from './app_actions';
import {Exchange} from './exchange_actions';

import {
  getDocuments,
  getTSVForm,
  postRevisions,
  getAnswer
} from '../api/magma_api';

// Required export for unit testing.
export const addTemplate = (template, project_name)=>{
  return {
    type: 'ADD_TEMPLATE',
    project_name,
    model_name: template.name,
    template: template
  };
};

// Required export for unit testing.
export const addDocuments = (model_name, documents, project_name)=>{
  return {
    type: 'ADD_DOCUMENTS',
    project_name,
    model_name: model_name,
    documents: documents
  };
};

// Required export for unit testing.
export const addPredicates = (predicates)=>{
  return {
    type: 'ADD_PREDICATES',
    predicates
  };
};

export const reviseDocument = (doc, tmplt, attr, rev_val, prj_nm)=>{
  prj_nm = (prj_nm == undefined) ? APP_CONFIG.project_name : prj_nm;
  return {
    type: 'REVISE_DOCUMENT',
    project_name: prj_nm,
    model_name: tmplt.name,
    record_name: doc[tmplt.identifier],
    revision: {
      [attr.name]: rev_val
    }
  };
};

export const discardRevision = (record_name, model_name, prj_nm)=>{
  prj_nm = (prj_nm == undefined) ? APP_CONFIG.project_name : prj_nm;
  return {
    type: 'DISCARD_REVISION',
    project_name: prj_nm,
    model_name: model_name,
    record_name: record_name
  };
};

/*
 * Here we add the models and documents to the store. At the same time we strip
 * off the model namespacing. The server returns the full name of the model.
 * And we want that behavior so we can know from which project the data is
 * coming from. However, we do not want to propigate that namespacing to the UI.
 */
const consumePayload = (dispatch, response, project_name)=>{
  if(response.models){
    Object.keys(response.models).forEach((model_name)=>{
      let model = response.models[model_name];

      // Send the template to the store if it exists.
      if(model.template){

        // Fetch the dictionary if named.
        if(model.template.dictionary){
          dispatch(
            requestDictionaries(
              model.template.dictionary.name,
              model.template.dictionary.project
            )
          );
        }

        dispatch(addTemplate(model.template, project_name));
      }

      // Send the documents to the store if it exists.
      if(model.documents){
        dispatch(addDocuments(model_name, model.documents, project_name));
      }
    });
  }
};

export const requestDocuments = (args, prj_nm = APP_CONFIG.project_name)=>{
  let {
    model_name,
    record_names,
    attribute_names,
    filter,
    page,
    page_size,
    collapse_tables,
    exchange_name,
    success,
    error
  } = args;

  return (dispatch)=>{
    let localSuccess = (response)=>{
      consumePayload(dispatch, response, prj_nm);
      if(success != undefined) success(response);
    };

    let localError = (err)=>{
      if(!err.response){
        dispatch(showMessages([String(err)]));
        return;
      }

      err.response.json().then((response)=>{
        let errs = response.errors.map((e)=> `* ${e}`);
        dispatch(showMessages(errs));
      });

      if(error != undefined) error(err);
    };

    let exchange = new Exchange(dispatch, exchange_name);
    let get_doc_args = [
      {
        model_name,
        record_names,
        attribute_names,
        filter,
        page,
        page_size,
        collapse_tables
      },
      exchange,
      prj_nm
    ];

    return getDocuments(...get_doc_args)
      .then(localSuccess)
      .catch(localError);
  };
};

export const requestDictionaries = (dictionary_name, project_name)=>{
  if(project_name == undefined) project_name = APP_CONFIG.project_name;

  return (dispatch)=>{
    let localSuccess = (response)=>{
      for(let dict_name in response.models){
        dispatch(addDocuments(
          dictionary_name,
          response.models[dictionary_name].documents,
          project_name
        ));
      }
    };

    let localError = (response)=>{
      console.log(response);
    };

    let exchange_name = `Dictionary ${dictionary_name} for ${project_name}`;
    let exchange = new Exchange(dispatch, exchange_name);
    let get_dict_args = [
      {
        model_name: dictionary_name,
        record_names: 'all',
        attribute_names: 'all'
      },
      exchange,
      project_name
    ];

    return getDocuments(...get_dict_args)
      .then(localSuccess)
      .catch(localError);
  }
};

export const requestModels = ()=>{
  let req_opts = {
    'model_name': 'all',
    'record_names': [],
    'attribute_names': 'all',
    'exchange_name': 'request-models'
  };

  return requestDocuments(req_opts);
};

export const requestIdentifiers = ()=>{
  let req_opts = {
    'model_name': 'all',
    'record_names': 'all',
    'attribute_names': 'identifier',
    'exchange_name': 'request-identifiers'
  };

  return requestDocuments(req_opts);
};

const revision_name = (mdl_nm, rec_nm, attr_nm)=>{
  return `revisions[${mdl_nm}][${rec_nm}][${attr_nm}]`;
};

// Append the revised data to a form.
const setFormData = (revisions, model_name)=>{
  var form = new FormData();
  for(var record_name in revisions){

    var revision = revisions[record_name];
    for(var attribute_name in revision){

      if(Array.isArray(revision[attribute_name])){

        revision[attribute_name].forEach((value)=>{
          let rev_nm = revision_name(model_name, record_name, attribute_name);
          return form.append(`${rev_nm}[]`, value);
        });
      }
      else{
        let rev_nm = revision_name(model_name, record_name, attribute_name);
        form.append(rev_nm, revision[attribute_name]);
      }
    }
  }

  return form;
};

export const sendRevisions = (args, prj_nm = APP_CONFIG.project_name)=>{
  return (dispatch)=>{

    let {model_name, revisions, success, error} = args;

    let localSuccess = (response)=>{
      consumePayload(dispatch, response, prj_nm);

      for(let record_name in revisions){
        dispatch(discardRevision(record_name, model_name));
      }

      if(success != undefined) success();
    };

    let localError = (err)=>{
      err.response.json().then((response)=>{
        let errs = response.errors.map((e)=> `* ${e}`);
        dispatch(showMessages(errs));
      });

      if(error != undefined) error(err);
    };

    let exchng = new Exchange(dispatch, `revisions-${model_name}`);
    let form_data = setFormData(revisions, model_name);
    return postRevisions(form_data, exchng, prj_nm)
      .then(localSuccess)
      .catch(localError);
  }
};
// Download a TSV from magma via browser application.
export const requestTSV = (model_name, filter, record_names)=>{
  return (dispatch)=>{
    return getTSVForm(model_name, filter, record_names);
  };
};

const requestAnswer = (question, callback, prj_nm = APP_CONFIG.project_name)=>{

  return (dispatch)=>{

    let localSuccess = (response)=>{
      if('error' in response){
        dispatch(showMessages([`There was a ${response.type} error.`]));
        console.log(response.error);
        return;
      }

      if(callback != undefined) callback(response);
    };

    let localError = (response)=>{
      console.log(response);
    };

    let question_name = question;
    if(Array.isArray(question)){
      question_name = [].concat.apply([], question).join('-');
    }

    let exchange = new Exchange(dispatch, question_name);
    return getAnswer(question, exchange)
      .then(localSuccess)
      .catch(localError);
  };
};

export const requestPredicates = ()=>{
  return (dispatch)=>{

    let localCallback = (response)=>{
      dispatch(addPredicates(response.predicates));
    };

    dispatch(requestAnswer('::predicates', localCallback));
  };
};
