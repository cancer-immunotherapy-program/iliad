// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import ClinicalInput from '../inputs/clinical_input';

// Module imports.
import {
  sendRevisions,
  reviseDocument
} from '../../actions/magma_actions';

import {
  selectModelDocuments,
  selectDictionaryByModel
} from '../../selectors/magma_selector';

import {
  nestDataset,
  setDefinitionUids,
  setSiblingUids
} from '../../selectors/selector_utils.js';

export class ClinicalAttribute extends React.Component{
  constructor(props){
    super(props);

    /*
     * There are three main data structures in the Clinical Attribute that keep
     * the data organized. The 'records' is the data from the DB in a fairly
     * flat object. The 'dictionary' is the data object that helps set the
     * validation on the possible values the records can take. The 'nested_uid'
     * is a mapping of the 'records' and 'dictionary'. The 'nested_uid' object
     * contains only the keys from the 'record' and 'dictionary'.
     *
     * 'records' can be nested and can have a hierarchy and this can be
     * difficult to work with. The 'nested_uid' data structure holds the
     * relations of the 'records' and the mappings of the 'dictionary'
     * validations.
     */
    this.state = {
      dictionary: {},
      nested_uids: []
    };
  }

  static getDerivedStateFromProps(next_props, prev_state){

    // If there is no data to update then return.
    if(
      Object.keys(next_props.records).length <= 0 ||
      Object.keys(next_props.dictionary).length <= 0
    ) return null;

    return {
      //records: next_props.records,
      dictionary: next_props.dictionary,
      nested_uids: next_props.nested_uids
    };
  }

  sendRevisionIntermediate(){
    /*
    let revisions = {}
    let records = this.state.records;
    for(let uid in records){
      if(records[uid].revised == true){

        revisions[uid] = {
          uid: uid,
          parent_uid: records[uid].parent_uid,
          subject_id: this.props.document.subject_id,
          name: records[uid].name,
          value: records[uid].value,
          restricted: true
        };
      }
    }

    let revision_args = {
      model_name: this.props.attribute.name,
      revisions
    };

    this.props.sendRevisions(revision_args);
    */
  }

  // Extract the defintions required for key inputs.
  selectDefinitionsForKeys(uids){
    let definitions = {};

    uids.forEach((uid)=>{
      let def = this.state.dictionary.definitions[uid];

      if(def == undefined){
        debugger;
      }

      if(!(def.name in definitions)){
        definitions[def.name] = Object.assign({}, def);
        definitions[def.name].value = definitions[def.name].name;
      }
    });

    return Object.keys(definitions).map((def_name)=>{
      return definitions[def_name];
    });
  }

  // Extract the definitions required for value inputs.
  selectDefinitionsForValues(uids){
    return uids.map((uid)=>{
      let def = Object.assign({}, this.state.dictionary.definitions[uid]);
      def['label'] = def.value;
      return def;
    });
  }

  selectSiblings(parent_uid){
    let definitions = this.state.dictionary.definitions;
    let siblings = [];

    for(let uid in definitions){
      if(parent_uid != definitions[uid].parent_uid) continue;
      siblings.push(uid);
    }

    return siblings;
  }

  setNestedUidRevision(rev_uid, revision, nested_uids){
    nested_uids.forEach((nested_uid, index)=>{
      if(rev_uid == nested_uid.uid){
        nested_uids[index] = Object.assign({}, nested_uid, revision);
      }

      if('children' in nested_uid){
        nested_uid.children = this.setNestedUidRevision(
          rev_uid,
          revision,
          nested_uids[index].children
        );
      }
    });

    return nested_uids;
  }

  nestedUidHasChildren(orig_uid, nested_uids){
    let has_children = false;
    nested_uids.forEach((nested_uid)=>{

      if(nested_uid.children.length > 0){
        if(orig_uid == nested_uid.uid){
          return true;
        }
        else{
          has_children = this.nestedUidHasChildren(
            orig_uid,
            nested_uid.children
          );
        }
      }
    });

    return has_children;
  }

  setRecordRevision(uid, revision, records){
    records[uid] = Object.assign({}, records[uid], revision);
    return records;
  }

  setChildren(def_parent_uid, rec_parent_uid){
    let child_recs = [];
    let child_defs = [];
    let child_siblings = [];
    let defs = this.state.dictionary.definitions;

    for(let def_uid in defs){
      if(defs[def_uid].parent_uid == def_parent_uid){

        // Add to the sibling grouping.
        child_siblings.push(def_uid);

        // For each unique named definition we add a child record.
        if(!(defs[def_uid].name in child_defs)){

          let random_uid = `new-${Math.random().toString(16).slice(2, -1)}`

          // Set initial child nested ids.
          child_defs[defs[def_uid].name] = {
            uid: random_uid,
            definition: null,
            definitions: [def_uid],
            children: []
          };

          // Set unique child record.
          child_recs.push({
            uid: random_uid,
            parent_uid: rec_parent_uid,
            name: defs[def_uid].name,
            revised: true,
            value: null
          });
        }
        else{

          // Append the definion uid to the child.
          child_defs[defs[def_uid].name].definitions.push(def_uid);
        }
      }
    }

    // Add the siblings and definitions to the child node.
    let new_child_defs = []
    for(let name in child_defs){
      child_defs[name]['siblings'] = child_siblings;
      new_child_defs.push(child_defs[name]);
    }

    let child_uids = {
      uid: rec_parent_uid,
      children: new_child_defs
    };
    return [child_recs, child_uids];
  }

  reviseRecord(event){
    let revision_records = {
      uid: event.target.dataset.uid,
      value: event.target.value,
      revised: true
    };

    // Pull the definition uid for the revised data.
    let defs = this.state.dictionary.definitions;
    let def = Object.keys(defs).filter((uid)=>{
      if(
        defs[uid].name == event.target.dataset.name &&
        defs[uid].value == event.target.value
      ) return defs[uid];
    });

    // Make sure the definition is properly set on the revision.
    let revision_uids = {
      uid: event.target.dataset.uid,
      definition: def[0],
    }

    // Update the actual record.
    let records = this.setRecordRevision(
      event.target.dataset.uid,
      revision_records,
      this.props.records
    );

    // Update the nested_uid object.
    let nested_uids = this.setNestedUidRevision(
      event.target.dataset.uid,
      revision_uids,
      this.state.nested_uids
    );

    // If there are no definitions here then there should be no children.
    if(def.length > 0){

      // The data to update for the children.
      let children = this.setChildren(def[0], event.target.dataset.uid);
      let child_records = children[0];
      let child_uids = children[1];

      if(!this.nestedUidHasChildren(child_uids.uid, nested_uids)){

        /*
         * If we have child records to add loop them and assign them to the main
         * record object by uid.
         */
        child_records.forEach((child_record)=>{
          records = Object.assign(
            records,
            {[child_record.uid]: child_record}
          );
        });

        nested_uids = this.setNestedUidRevision(
          event.target.dataset.uid,
          child_uids,
          nested_uids
        );
      }
    }

    this.setState({nested_uids});
    reviseDocument(
      this.props.document,
      this.props.template,
      this.props.attribute,
      records
    );
  }

  /*
   * The individual entries are made of key/record pairs. Here we set the key
   * which should set the definition for the value (which allows validation).
   */
  reviseKey(event){
    let {doucment, template, attribute, records} = this.props;
    let {nested_uids} = this.state;

    // Set the name of the definition we chose.
    let revision_records = {
      uid: event.target.dataset.uid,
      name: event.target.value
    };

    // Extract the id's for matching definitions.
    let defs = this.state.dictionary.definitions;
    let revision_uids = {
      uid: event.target.dataset.uid,
      definition: null,
      definitions: Object.keys(defs).filter((uid)=>{
        if(defs[uid].name == event.target.value) return uid;
      })
    };

    /*
     * If there is a single definition it means that this is not a multi-select.
     * Which also means we can set the sub children.
     */
    let child_records = [];
    let child_uids = {};
    if(revision_uids.definitions.length == 1){
      revision_uids.definition = revision_uids.definitions[0];

      let children = this.setChildren(
        revision_uids.definitions[0],
        event.target.dataset.uid
      );

      child_records = children[0];
      child_uids = children[1];
    }

    records = this.setRecordRevision(
      event.target.dataset.uid,
      revision_records,
      this.props.records
    );

    nested_uids = this.setNestedUidRevision(
      event.target.dataset.uid,
      revision_uids,
      this.state.nested_uids
    );

    /*
     * If we have child records to add loop them and assign them to the main
     * record object by uid.
     */
    child_records.forEach((child_record)=>{
      records = Object.assign(
        records,
        {[child_record.uid]: child_record}
      );
    });

    if(child_uids){
      nested_uids = this.setNestedUidRevision(
        event.target.dataset.uid,
        child_uids,
        nested_uids
      );
    }

    this.setState({nested_uids});
    reviseDocument(document, template, attribute, records);
  }

  addRecord(){
    let random_uid = `new-${Math.random().toString(16).slice(2, -1)}`;
    let {doucment, template, attribute, records} = this.props;

    records[random_uid] = {
      uid: random_uid,
      name: null,
      parent_uid: null,
      value: null,
      revised: false
    };

    let nested_uids = this.state.nested_uids;
    nested_uids.unshift({
      uid: random_uid,
      siblings: this.selectSiblings(null),
      definitions: [],
      definition: null,
      children: []
    });

    this.setState({nested_uids});
    reviseDocument(document, template, attribute, records);
  }

  removeRecord(uid){
    if(!confirm('Are you sure you want to delete this record?')) return;

    let {document, template, attribute, records} = this.props;
    let nested_uids = this.state.nested_uids;

    if(uid in records){
      delete records[uid];
      nested_uids.forEach((nested_uid, index)=>{
        if(nested_uid.uid == uid) nested_uids.splice(index, 1);
      });
    }

    this.setState({nested_uids});
    reviseDocument(document, template, attribute, records);
  }

  renderRemoveBtn(is_parent, uid){
    if(this.props.mode != 'edit') return null;
    if(!is_parent) return null;

    let remove_btn_props = {
      className: 'clinical-remove-btn',
      title: 'Remove record.',
      onClick: this.removeRecord.bind(this, uid)
    };

    let remove_btn = (
      <button {...remove_btn_props}>

        <i className='far fa-times-circle'></i>
        &nbsp;{'REMOVE'}
      </button>
    );

    return remove_btn;
  }

  /*
   * This function takes the 'nested_uid' data structue. We iterate over this
   * structure and select out the definition or record by the uid.
   */
  renderRecord(uid_set, is_parent){
    let child_elements = [];
    uid_set.children.forEach((child)=>{
      child_elements.push(this.renderRecord(child, false));
    });

    let record = this.props.records[uid_set.uid];
    let definition = this.props.dictionary.definitions[uid_set.definition];
    let type = null;
    if(uid_set.definitions.length > 0){
      type = this.props.dictionary.definitions[uid_set.definitions[0]].type;
    }

    let multi_select = ['regex', 'dropdown', 'select', 'boolean'];

    let input_value_props = {
      uid: uid_set.uid,
      name: record.name,
      type: type,
      value: record.value,
      values: this.selectDefinitionsForValues(uid_set.definitions),
      def_ids: uid_set.definitions,
      editing: (
        (multi_select.indexOf(type) == -1 || child_elements.length == 0) &&
        this.props.mode == 'edit'
      ),
      onChange: this.reviseRecord.bind(this)
    };

    let input_name_props = {
      uid: uid_set.uid,
      name: record.name,
      type: 'key',
      value: record.name,
      values: this.selectDefinitionsForKeys(uid_set.siblings),
      def_ids: uid_set.definitions,
      editing: (record.name == null && this.props.mode == 'edit'),
      onChange: this.reviseKey.bind(this)
    };

    let group_props = {
      className: 'clinical-record-group',
      key: `record_${record.uid}`
    };

    return(
      <div {...group_props}>

        <ClinicalInput {...input_name_props} />
        <ClinicalInput {...input_value_props} />
        {this.renderRemoveBtn(is_parent, uid_set.uid)}
        {child_elements}
      </div>
    );
  }

  renderData(){
    let {records} = this.props;
    let {dictionary, nested_uids} = this.state;

    // Check that all the required data to render is present.
    if(
      Object.keys(records).length <= 0 ||
      Object.keys(dictionary).length <= 0 ||
      Object.keys(dictionary.definitions).length <= 0
    ) return <div>{'No records.'}</div>;

    // Loop the records and render them by group.
    let elements = [];
    nested_uids.forEach((nested_uid)=>{
      elements.push(this.renderRecord(nested_uid, true));
    })

    return elements;
  }

  renderEditButtons(){
    if(this.props.mode != 'edit') return null;

    let add_btn_props = {
      className: 'clinical-record-btn',
      onClick: this.addRecord.bind(this)
    };

/*
    let save_btn_props = {
      className: 'clinical-record-btn',
      onClick: this.sendRevisionIntermediate.bind(this)
    };
*/

    return(
      <button {...add_btn_props}>

        <i className='fas fa-plus'></i>
        &nbsp;{'ADD'}
      </button>
    );
  }

  renderDownload(){
    return null; // Disabling this button until we can hook up the events.

    let export_props = {
      className: 'pager-export-btn',
      type: 'button'
    };

    return(
      <div className='pager-group'>

        <button {...export_props}>

          <i className='fas fa-download' aria-hidden='true' ></i>
          &nbsp;{'DOWNLOAD'}
        </button>
      </div>
    );
  }

  renderCount(){
    let {records} = this.props;
    let row_count = (records) ? Object.keys(records).length : 0;

    return(
      <div className='table-view-size'>

        <i className='far fa-list-alt'></i>
        &nbsp;&nbsp;{`${row_count} rows`}
      </div>
    );
  }

  render(){
    return(
      <div>

        {this.renderCount()}
        {this.renderDownload()}
        {this.renderEditButtons()}
        <div className='clinical-group'>

          <div className='clinical-group-header-bar' />
          {this.renderData()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, own_props)=>{
  /*
   * The main goal of processing the data here is to:
   * 1. Attach the basic defintions to the documents.
   * 2. Nest the documents in their proper hierarchy.
   */
  let args = [
    state,
    APP_CONFIG.project_name,
    own_props.attribute.model_name,
    'all'
  ];

  let dictionary = selectDictionaryByModel(...args);
  let records = selectModelDocuments(...args);

  /*
   * Trim out 'identifier serch' items. We need fix the identifier search to not
   * use these.
   */
  //for(let uid in records){
  //  if(!('name' in records[uid])) delete records[uid];
  //}

  let uid_set = setDefinitionUids(records, dictionary , {});
  uid_set = setSiblingUids(records, dictionary, uid_set);
  uid_set = nestDataset(uid_set, 'uid', 'parent_uid');
  uid_set = Object.keys(uid_set).map((key)=>uid_set[key]);

  return {
    records: records,
    dictionary: dictionary,
    nested_uids: uid_set
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    sendRevisions: (args)=>{
      dispatch(sendRevisions(args));
    }
  };
};

export const ClinicalAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(ClinicalAttribute);
