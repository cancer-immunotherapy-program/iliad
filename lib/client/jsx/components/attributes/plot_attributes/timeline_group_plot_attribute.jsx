import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import {GenericPlotAttribute} from './generic_plot_attribute';
import TimelinePlot from '../../plotter_d3_v5/plots/timeline_plot/timeline_graph';
import Resize from '../../plotter_d3_v5/resize';

// Module imports.
import {
  requestConsignmentsByManifestId
} from '../../../actions/manifest_actions';
import {
  selectConsignment
} from '../../../selectors/consignment_selector';
import {
  nestDataset
} from '../../../selectors/selector_utils';

export class TimelineGroupPlotAttribute extends GenericPlotAttribute{
  constructor(props){
    super(props);
    this.state = {records: null};
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
      <div id='timeline_charts' className='value'>
        {this.state.records && <Resize render={width  => (
          <TimelinePlot {...plot_props} parent_width={width} />
        )}/>}
      </div>
    )
  }
}

const processData = (matrix)=>{
  let data_obj = {};
  matrix.rows.forEach((row)=>{
    data_obj[row[0]] = {
      uid: row[0],
      parent_uid: row[1],
      name: row[2],
      value: row[3],
      patient_id: row[4]
    };
  });

  return data_obj;
};

const flattenDataSet = (object)=>{
  let data_obj = {
    [object['name']]: object['value'],
    patient_id: object['patient_id']
  };

  let child_obj = {};
  if('children' in object){
    for(let uid in object['children']){
      child_obj = flattenDataSet(object['children'][uid]);
      data_obj = Object.assign(data_obj, child_obj);
    }
  }

  return data_obj;
};

const mapStateToProps = (state = {}, own_props)=>{
  let selected_plot, selected_manifest, selected_consignment = undefined;
  let records;

  selected_manifest = state.manifests[own_props.attribute.manifest_id];

  if(selected_manifest != undefined){
    selected_consignment = selectConsignment(
      state,
      selected_manifest.md5sum
    );
  }

  let processed_data = {};
  let record_array = []
  if(selected_consignment){

    for(let key in selected_consignment){
      if(key == 'record_name') continue;
      switch(key){
        case 'study_treatment':

          // Extract the data objects from the consignment matrix.
          processed_data[key] = processData(selected_consignment[key]);

          // Group the data objects by their uids.
          processed_data[key] = nestDataset(
            processed_data[key],
            'uid',
            'parent_uid'
          );

          // Flatten out the grouped objects.
          for(let uid in processed_data[key]){
            processed_data[key][uid] = flattenDataSet(
              processed_data[key][uid]
            );
          }

          for(let uid in processed_data[key]){

            if(processed_data[key][uid][key+'_start'] == undefined) continue;

            processed_data[key][uid]['uid'] = uid;
            processed_data[key][uid]['name'] = key;
            processed_data[key][uid]['label'] = processed_data[key][uid][key+'_type'] + ` (${processed_data[key][uid]['patient_id']})`;
            processed_data[key][uid]['group'] = processed_data[key][uid]['patient_id'];

            let start_str = processed_data[key][uid][key+'_start'];
            start_str = new Date(start_str).toUTCString();
            if(start_str != 'Invalid Date'){
              processed_data[key][uid]['start'] = start_str;
            }

            let end_str = processed_data[key][uid][key+'_end'];
            end_str = new Date(end_str).toUTCString();
            if(end_str != 'Invalid Date'){
              processed_data[key][uid]['end'] = end_str;
            }

            record_array.push(processed_data[key][uid]);
          }
          break;
        default:
          break;
      }
    }
  }

  return {
    selected_consignment,
    selected_manifest,
    records: record_array
  }
}

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    fetchConsignment: (manifest_id, record_name)=>{
      dispatch(requestConsignmentsByManifestId(
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
