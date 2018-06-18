import {showMessages} from './message_actions';
import {Exchange} from './exchange_actions';

import {
  getDocuments,
  getTSVForm,
  postRevisions,
  getAnswer
} from '../api/magma_api';

const addTemplate = (template, project_name)=>{
  return {
    type: 'ADD_TEMPLATE',
    project_name,
    model_name: template.name,
    template: template
  };
};

const addDocumentsForTemplate = (model_name, documents, project_name)=>{
  return {
    type: 'ADD_DOCUMENTS',
    project_name,
    model_name: model_name,
    documents: documents
  };
};

export const reviseDocument = (doc, tmplt, attr, rev_val, prj_nm)=>{
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

export const discardRevision = (record_name, model_name, project_name)=>{
  return {
    type: 'DISCARD_REVISION',
    project_name,
    model_name: model_name,
    record_name: record_name
  };
};

const addPredicates = (predicates)=>{
  return {
    type: 'ADD_PREDICATES',
    predicates
  };
};

const addDictionary = (dictionary_name, definitions, project_name)=>{
  return {
    type: 'ADD_DICTIONARY',
    dictionary_name,
    definitions,
    project_name
  };
};

const consumePayload = (dispatch, response, project_name)=>{
  if(response.models){
    Object.keys(response.models).forEach((model_name)=>{
      let model = response.models[model_name];

      if(model.template){
        dispatch(addTemplate(model.template, project_name));
      }

      if(model.documents){
        dispatch(addDocumentsForTemplate(
          model_name,
          model.documents,
          project_name
        ));
      }
    });
  }
};

export const requestDocuments = (args, prj_nm = TIMUR_CONFIG.project_name)=>{
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
      if('error' in response){
        dispatch(showMessages([`There was a ${response.type} error.`]));
        console.log(response.error);
        return;
      }

      consumePayload(dispatch, response, prj_nm);
      if(success != undefined) success(response);
    };

    let localError = (e) => {
      if (!e.response) {
        dispatch(showMessages([`Something is amiss. ${e}`]));
        return;
      }


      e.response.json().then((response)=>{
        let errStr = response.errors.map((error)=> `* ${error}`);
        errStr = [`### Our request was refused.\n\n${errStr}`];
        dispatch(showMessages(errStr));
      });

      if(error != undefined){
        let message = JSON.parse(error.response);
        error(message);
      }
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

    getDocuments(...get_doc_args)
      .then(localSuccess)
      .catch(localError);
  };
};

export const requestDictionaries = (args, prj_nm = TIMUR_CONFIG.project_name)=>{
  let {dictionary_name} = args;

  return (dispatch)=>{
    let localSuccess = (response)=>{
      for(let dict_name in response.models){
        dispatch(addDictionary(
          `${project_name}_${dictionary_name}`,
          response.models[dictionary_name].documents
        ));
      }
    };

    let localError = (response)=>{
      console.log(response);
    };

    let exchange_name = `Dictionary ${dictionary_name} for ${prj_nm}`;
    let exchange = new Exchange(dispatch, exchange_name);
    let get_dict_args = [
      {
        model_name: dictionary_name,
        record_names: 'all',
        attribute_names: 'all'
      },
      exchange,
      prj_nm
    ];

    getDocuments(...get_dict_args)
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

const revision_name = (prj_nm, mdl_nm, rec_nm, attr_nm)=>{
  return `revisions[${prj_nm}][${mdl_nm}][${rec_nm}][${attr_nm}]`;
};

// Append the revised data to a form.
const setFormData = (revisions, project_name, model_name)=>{
  var form = new FormData();
  for(var record_name in revisions){

    var revision = revisions[record_name];
    for(var attribute_name in revision){

      if(Array.isArray(revision[attribute_name])){

        revision[attribute_name].forEach((value)=>{
          let rev_nm = revision_name(
            project_name,
            model_name,
            record_name,
            attribute_name
          );
          return form.append(rev_nm+'[]', value);
        });
      }
      else{
        let rev_nm = revision_name(
          project_name,
          model_name,
          record_name,
          attribute_name
        );
        form.append(rev_nm, revision[attribute_name]);
      }
    }
  }

  return form;
};

export const sendRevisions = (args, project_name = TIMUR_CONFIG.project_name)=>{
  let {model_name, revisions, success, error} = args;

  return (dispatch)=>{

    let localSuccess = (response)=>{
      consumePayload(dispatch, response, project_name);

      for(let record_name in revisions){
        dispatch(discardRevision(record_name, model_name, project_name));
      }

      if(success != undefined) success();
    };

    let localError = (e)=>{
      e.response.json().then((response)=>{
        let errStr = response.errors.map((error)=> `* ${error}`);
        errStr = [`### The change we sought did not occur.\n\n${errStr}`];
        dispatch(showMessages(errStr));
      });

      if(error != undefined) error();
    };


    let exchng = new Exchange(dispatch, `revisions-${model_name}`);
    let form_data = setFormData(revisions, project_name, model_name);
    postRevisions(form_data, exchng, project_name)
      .then(localSuccess)
      .catch(localError);
  };
};

const requestAnswer = (question, callback, prj_nm =TIMUR_CONFIG.project_name)=>{

  return (dispatch)=>{

    let localSuccess = (response)=>{
      if('error' in response){
        dispatch(showMessages([`There was a ${response.type} error.`]));
        console.log(response.error);
        return;
      }

      if(callback != undefined) callback(response);
    };

    let localError = (error)=>{
      console.log(error);
    };

    let question_name = question;
    if(Array.isArray(question)){
      question_name = [].concat.apply([], question).join('-');
    }

    let exchange = new Exchange(dispatch, question_name);
    getAnswer(question, exchange, prj_nm)
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

// Download a TSV from magma via Timur.
export const requestTSV = (model_name, filter)=>{
  return (dispatch)=>{
    getTSVForm(model_name, filter);
  };
};
