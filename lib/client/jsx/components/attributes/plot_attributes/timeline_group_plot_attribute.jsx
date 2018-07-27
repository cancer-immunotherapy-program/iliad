import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import {GenericPlotAttribute} from './generic_plot_attribute';
import TimelinePlot from '../../plotter_d3_v5/plots/timeline_plot/timeline_graph';
import Resize from '../../plotter_d3_v5/resize';


// Module imports.
import * as ManifestActions from '../../../actions/manifest_actions';
import * as ConsignmentSelector from '../../../selectors/consignment_selector';


export class TimelineGroupPlotAttribute extends GenericPlotAttribute{
  constructor(props) {
    super(props);

    this.state = {
      records: null,
    };
  }

  static getDerivedStateFromProps(next_props, prev_state){

    if(
        Object.keys(next_props).length <= 0 || 
        next_props.selected_consignment === null
    ) return null;
    

    return {
      records: next_props.records
    };
  }

  render(){ 
    let plot_props = {
      all_events: this.state.records,
      color:'#29892a'
    };

    return(
      <div id='timeline_group_chart' className='value'>
        {this.state.records && <Resize render={width  => (
          <TimelinePlot {...plot_props} parent_width={width} />
        )}/>}
      </div>
    )
  }
}

const nestDataset = (records, key, parent_key)=>{

  /*
   * Set the children object on each record if not present, and isolate the root
   * objects.
   */
  let nodes = [];
  for(let id in records){
    if(!('children' in records[id])) records[id]['children'] = {};
    if(records[id][parent_key] == null) nodes.push(records[id]);
  }

  while(nodes.length > 0){
    let node = nodes.pop();

    for(let id in records){

      /*
       * Match the current child's 'parent_key' with the current node's key. Add
       * the child to the nodes array to keep the match making active. Remove
       * the the child from the records object.
       */
      if(node[key] == records[id][parent_key]){
        records[node[key]].children[id] = records[id];
        nodes.push(records[id]);
      }
    }
  }

  for(let id in records){
    if(records[id][parent_key] != null) delete records[id];
  }

  return records;
}

/* 
 * This is a temporary shim. Key for date should be normalized in the
 * database.
 */
let normalizeDateName = (name) => {
  switch(name) {
    case 'prior_treatment_start':
    case 'study_treatment_start':
    case 'start_date':
      return 'start';
    case 'prior_treatment_end':
    case 'study_treatment_end':
    case 'end_date':
      return 'end';
    default:
      return name;
  } 
}

let hashPatientData = (hashed_obj, array) => {
  for(let category of array) {
    if(category) {
      for(let index = 0; index < category.row_names.length; ++index){

        let uid = category.row_names[index];
        hashed_obj[uid] = {
          uid: uid,
          parent_uid: category.rows[index][0],
          name: normalizeDateName(category.rows[index][1]),
          value: category.rows[index][2],
          patient_id: category.rows[index][3]
        };
      }
    }
  }
}

let uniqueTypeByDate = (array) => {
  array.sort((a,b) => {
    return new Date(a.start) - new Date(b.start);
  });
  array.map((obj, index) => {
    obj.type = `${obj.type} ${++index}`;
  });
  return array;
}

let flatten = (nested_obj, array, level) => {
  array = array || [];
  level = level || 1;
  for(let obj in nested_obj) {
    array.push({
      name: `${'· '.repeat(level)} ${nested_obj[obj].name.replace(/_/g, ' ')}`,
      value: nested_obj[obj].value,
    });
    if(
      typeof nested_obj[obj].children === "object" && 
      Object.keys(nested_obj[obj].children).length !== 0
    ) {
      let next_level = level + 1;
      flatten(nested_obj[obj].children, array, next_level);
    }
  }
  return array;
}

let normalizePatientDataD3 = (records) => {
  let d3_records = [];
  let count = 0;
  for(let record in records) {
    count++;
    let d3_record = {};
    d3_record.data = [];
    d3_record.name = records[record].name;
    d3_record.type = records[record].name.replace(/[_-]/g, " "); 
    d3_record.event_id = `${records[record].patient_id} ${records[record].name} ${count++}`;
    d3_record.patient_id = records[record].patient_id;

    if(records[record].name === 'diagnosis_date') {
      let time_str = new Date(records[record].value).toUTCString();
      let parts = time_str.split(' ');
      let utc_time_str = `${parts[1]}-${parts[2]}-${parts[3]}`;
      d3_record.start = utc_time_str;
    }

    for(let child in records[record].children) {
      let  name = records[record].children[child].name;

      if(name === 'start' || name === 'end'){
        d3_record[name]=records[record].children[child].value;
      } 
      else {

        d3_record.data.push({
          name: records[record].children[child].name.replace(/_/g, ' '),
          value: records[record].children[child].value,
          children: records[record].children[child].children
        });

        if(records[record].children[child].children !== null) {
          let array = flatten(records[record].children[child].children);
          d3_record.data = [...d3_record.data, ...array];
        }
      }
    
    }
    d3_records.push(d3_record);
  }
  // Group patient data by type 
  let prior_treatment_arr = [];
  let treatment_arr = [];
  let diagnostic_arr = [];

  d3_records.forEach(record => {
    switch(record.name) {
      case 'diagnosis_date':
        diagnostic_arr.push(record);
        break;
      case 'prior_treatment':
        prior_treatment_arr.push(record);
        break;
      case 'study_treatment':
        treatment_arr.push(record);
        break;
      default:
          break;
    }
  })

  // prior_treatment_arr = uniqueTypeByDate(prior_treatment_arr);
  // treatment_arr = uniqueTypeByDate(treatment_arr);
  // diagnostic_arr = uniqueTypeByDate(diagnostic_arr);

  return [...prior_treatment_arr, ...treatment_arr, ...diagnostic_arr];
}

let normalizeAEPatientDataD3 = (hashed_obj, array) => {
  let adverse_events_arr = [];
  let prior_adverse_events_arr = [];
    
  // create hashed objects for adverse events data.
  for(let category of array){
    if(category) {
      for(let index = 0; index < category.rows.length; ++index){
        let meddra_code = category.rows[index][0];
        let utc_start_str;
        let utc_end_str; 

        if(category.rows[index][2]){
          let start = category.rows[index][2].toString().split(' ');
          utc_start_str  = `${start[2]}-${start[1]}-${start[3]}`;
        }

        if(category.rows[index][3]){
          let end = category.rows[index][3].toString().split(' ');
          utc_end_str  = `${end[2]}-${end[1]}-${end[3]}`;
        }

        hashed_obj[meddra_code] = {
          data: [{name: 'Grade', value: category.rows[index][1]}],
          start: utc_start_str || null,
          end: utc_end_str || null,
          name: category.rows[index][4],
          type: category.rows[index][4]
        };

        if(hashed_obj[meddra_code].name === 'adverse_events'){
          adverse_events_arr.push(hashed_obj[meddra_code]);
        }

        if(hashed_obj[meddra_code].name === 'prior_adverse_events'){
          prior_adverse_events_arr.push(hashed_obj[meddra_code]);
        }
      }
    }
  }

  adverse_events_arr = uniqueTypeByDate(adverse_events_arr);
  prior_adverse_events_arr = uniqueTypeByDate(prior_adverse_events_arr);

  return [...adverse_events_arr, ...prior_adverse_events_arr]
};

Array.prototype.sortBy = function(p) {
  return this.slice(0).sort(function(a,b) {
    return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
  });
}

const mapStateToProps = (state = {}, own_props)=>{
  let selected_plot, selected_manifest, selected_consignment = undefined;
  let records;
  let hashed_obj = {};
  let sorted;

  selected_manifest = state.manifests['188'];

  if(selected_manifest != undefined){
    selected_consignment = ConsignmentSelector.selectConsignment(
      state,
      selected_manifest.md5sum
    );
  }

  if(selected_consignment){
    let {
      diagnostic_data, 
      treatment_data,
      prior_treatment_data,
      adverse_events,
      prior_adverse_events
    } = selected_consignment;

    console.log("============== selected consignment =================")
    console.log(selected_consignment);

    let patients_data = [
      diagnostic_data, 
      treatment_data
    ];
    
    let ae_patient_data = [
      adverse_events,
      prior_adverse_events
    ];

    hashPatientData(hashed_obj, patients_data);
    hashed_obj = nestDataset(hashed_obj, 'uid', 'parent_uid');
    records = normalizePatientDataD3(hashed_obj);
    sorted = records.sortBy('event_id');

    console.log("============== records =================")
    console.log(records);
    console.log("============== sorted =================")
    console.log(sorted);

    // prior_adverse_events.col_names.push('name');
    // prior_adverse_events.rows.map(row => {row.push('prior_adverse_events');});
    // adverse_events.col_names.push('name');
    // adverse_events.rows.map(row => {row.push('adverse_events');});
    // ae_records = normalizeAEPatientDataD3(hashed_obj, ae_patient_data);

    // records = [...ae_records, ...records];  
  }

  return {
    selected_consignment,
    selected_manifest,
    records: sorted
  }
}

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    fetchConsignment: (manifest_id, record_name)=>{
      dispatch(ManifestActions.requestConsignmentsByManifestId(
        [manifest_id],
        record_name
      ));
    }
  };
}

export const TimelineGroupAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineGroupPlotAttribute);