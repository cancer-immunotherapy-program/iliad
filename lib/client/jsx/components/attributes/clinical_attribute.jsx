// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import ClinicalInput from '../inputs/clinical_input';

// Module imports.
import {
  sendRevisions,
  reviseTable
} from '../../actions/magma_actions';

import {
  selectModelDocuments,
  selectDictionaryByModel,
  selectModelRevisions
} from '../../selectors/magma_selector';

import {
  nestDataset,
  setDefinitionUids
} from '../../selectors/selector_utils.js';

/*
 * There are three main data structures in the Clinical Attribute that keep
 * the data organized. The 'records' is the data from the DB in a fairly
 * flat object. The 'dictionary' is the data object that helps set the
 * validation on the possible values the records can take. The 'nested_uid'
 * is a mapping of the 'records' and 'dictionary'. The 'nested_uid' object
 * contains only the keys from the 'record' and 'dictionary'.
 *
 * 'records' can be nested and can have a hierarchy and this can be
 * difficult to work with. To get the best of both worlds (a flat set of
 * records and a tree of relations) the 'nested_uid' data structure holds
 * the relations of the 'records' and the mappings of the 'dictionary'
 * validations separate from the 'records' themselves.
 */

export class ClinicalAttribute extends React.Component{
  constructor(props){
    super(props);

    this.state = {
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
      nested_uids: next_props.nested_uids
    };
  }

  // Extract the defintions required for key inputs.
  selectDefinitionsForKeys(uids){
    let definitions = {};

    uids.forEach((uid)=>{
      let def = this.props.dictionary.definitions[uid];

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
      let def = Object.assign({}, this.props.dictionary.definitions[uid]);
      def['label'] = def.value;
      return def;
    });
  }

  reviseRecord(event){
    let {attribute, records, reviseTable} = this.props;
    this.addChildRecordsProxie('value', event.target);
    records[event.target.dataset.uid]['value'] = event.target.value;
    reviseTable(attribute.model_name, records);
  }

  reviseKey(event){
    let {attribute, records, reviseTable} = this.props;
    this.addChildRecordsProxie('key', event.target);
    records[event.target.dataset.uid]['name'] = event.target.value;
    reviseTable(attribute.model_name, records);
  }

  /*
   * When add children to a record we have a few considerations. If the record
   * has multiple selections we first must wait until a option/value is
   * selected. If the record only has one input (i.e. date, sttring, or number)
   * we will know at the time of key selection which children are next and
   * required.
   */
  addChildRecordsProxie(revision_type, elem){
    let option_uid = null;

    switch(revision_type){
      case 'key':
        // The 'option_uid' is also the dictionary definition uid we select for.
        option_uid = elem.options[elem.selectedIndex].dataset.option_uid;

        let definitions = this.props.dictionary.definitions;
        let def = definitions[option_uid];

        let def_count = Object.keys(definitions).reduce((acc, key)=>{
          if(definitions[key].name == elem.value) ++acc;
          return acc;
        }, 0);

        if(
          (def.type != 'dropdown' || def.type != 'checkbox') &&
          def_count == 1
        ) this.addChildRecords(option_uid, elem.dataset.uid);

        break;
      case 'value':

        switch(elem.getAttribute('type')){
          case 'search':

            let list_id = elem.getAttribute('list');
            let list_options = document.getElementById(list_id).options;
            for(let a = 0; a < list_options.length; ++a){
              if(list_options[a].innerText == elem.value){
                option_uid = list_options[a].dataset.option_uid;
                break;
              }
            }

            this.addChildRecords(option_uid, elem.dataset.uid);
            break;
          case 'dropdown':
            option_uid = elem.options[elem.selectedIndex].dataset.option_uid;
            this.addChildRecords(option_uid, elem.dataset.uid);
            break;
        }

        break;
    }
  }

  addChildRecords(parent_def_uid, parent_rec_uid){

    /*
     * From the dictionary separate all the definitions with the same
     * 'parent_def_uid' and group the definitions by name/term.
     */

    let {definitions} = this.props.dictionary;
    let next_def_set = {};

    // Loop over all of the definitions.
    for(let uid in definitions){
      let def = definitions[uid];

      /*
       * Select out the definitions whos 'parent_uid' match our current
       * 'parent_def_uid'.
       */
      if(def.parent_uid == parent_def_uid){

        // Group the definitons by name.
        if(!(def.name in next_def_set)) next_def_set[def.name] = [];
        next_def_set[def.name].push(def);
      }
    }

    // Loop the sorted names and add the child records.
    for(let name in next_def_set){
      this.addRecord(name, parent_rec_uid, null);
    }
  }

  // This will proxie for an 'add' onClick.
  addRecordProxie(event){
    this.addRecord(null, null, null);
  }

  addRecord(name = null, parent_uid = null, value = null){
    let random_uid = `new-${Math.random().toString(16).slice(2, -1)}`;
    let {attribute, records, reviseTable} = this.props;

    records[random_uid] = {uid: random_uid, name, parent_uid, value};
    reviseTable(attribute.model_name, records);
  }

  removeRecord(uid){
/*
    if(!confirm('Are you sure you want to delete this record?')) return;

    let {attribute, records, reviseTable} = this.props;
    let nested_uids = this.state.nested_uids;

    if(uid in records){
      delete records[uid];
      nested_uids.forEach((nested_uid, index)=>{
        if(nested_uid.uid == uid) nested_uids.splice(index, 1);
      });
    }

    this.setState({nested_uids});
    reviseTable(attribute.model_name, records);
*/
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
    // Check that all the required data to render is present.
    if(
      Object.keys(this.props.records).length <= 0 ||
      Object.keys(this.props.dictionary).length <= 0 ||
      Object.keys(this.props.dictionary.definitions).length <= 0
    ) return <div>{'No records.'}</div>;

    // Loop the records and render them by group.
    let elements = [];
    this.state.nested_uids.forEach((uid_set)=>{
      elements.push(this.renderRecord(uid_set, true));
    })

    return elements;
  }

  renderEditButtons(){
    if(this.props.mode != 'edit') return null;

    let add_btn_props = {
      className: 'clinical-record-btn',
      onClick: this.addRecordProxie.bind(this)
    };

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

const mapStateToProps = (store, own_props)=>{
  /*
   * The main goal of processing the data here is to:
   * 1. Attach the basic defintions to the records.
   * 2. Nest the records in their proper hierarchy.
   */
  let args = [
    store,
    APP_CONFIG.project_name,
    own_props.attribute.model_name,
    'all'
  ];

  let dictionary = selectDictionaryByModel(...args);
  let revisions = selectModelRevisions(...args);
  let records = null;
  if(Object.keys(revisions).length > 0){
    records = revisions;
  }
  else{
    records = selectModelDocuments(...args);
  }

  /*
   * Trim out 'identifier serch' items. We need fix the identifier search to not
   * use these.
   */
  //for(let uid in records){
  //  if(!('name' in records[uid])) delete records[uid];
  //}

  let uid_set = setDefinitionUids(records, dictionary , {});
  uid_set = nestDataset(uid_set, 'uid', 'parent_uid');
  uid_set = Object.keys(uid_set).map((key)=>uid_set[key]);

  // New items that have not yet been saved should display on the top.
  uid_set.sort((a, b)=>(a.uid.startsWith('new-') ? -1 : 1));

  return {
    records,
    has_revisions: (Object.keys(revisions).length > 0),
    dictionary: dictionary,
    nested_uids: uid_set
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    reviseTable: (model_name, records)=>{
      dispatch(reviseTable(model_name, records));
    }
  };
};

export const ClinicalAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(ClinicalAttribute);
