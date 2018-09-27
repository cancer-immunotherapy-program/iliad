import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import {GenericPlotAttribute} from './generic_plot_attribute';
import TimelinePlot from '../../plotter_d3_v5/plots/timeline_plot/timeline_graph';
import Resize from '../../plotter_d3_v5/resize';

// Module imports.
import {requestConsignmentsByManifestId} from '../../../actions/manifest_actions';
import {selectConsignment} from '../../../selectors/consignment_selector';
import {nestDataset} from '../../../selectors/selector_utils';

export class TimelineGroupPlotAttribute extends GenericPlotAttribute{
  constructor(props){
    super(props);
    this.state = {
      records: null
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
    let plot_props = {all_events: this.state.records};
    let plot_func = (width)=>{
      return <TimelinePlot {...plot_props} parent_width={width} />;
    };

    return(
      <div id='timeline_group_chart' className='value'>
        {
          this.state.records &&
          <Resize className='resize-component' render={plot_func} />
        }
      </div>
    );
  }
}

const start_date_names = [
  'diagnosis_date',
  'prior_treatment_start',
  'study_treatment_start',
  'start_date'
];

const end_date_names = [
  'prior_treatment_end',
  'study_treatment_end',
  'end_date'
];

const processValueForDate = (value)=>{
  try{
    value = new Date(value).toUTCString();
    if(value == 'Invalid Date') date = null;
  }
  catch(error){
    console.log(`For name: '${name}', value: '${value}' is not a date`);
    value = null;
  }

  return value;
}

const selectColor = (type)=>{
  let colors = [
    '#24a684', // Iliad $dark-color, green
    '#666699', // Janus $grey-purple, purple
    '#3299bb', // CIP $med-blue, blue
    '#680148'  // Polyphemus $maroon, maroon
  ];

  switch(type){
    case 'diagnostics':
      return colors[0];
    case 'prior_treatments':
      return colors[1];
    case 'treatments':
      return colors[2];
    case 'adverse_events':
    case 'prior_adverse_events':
      return colors[3];
    default:
      return colors[0];
  }
}

const flattenDataSet = (object, type)=>{
  let data_obj = Object.assign(
    {[object['name']]: object['value']},
    object
  );

  let child_obj = {};
  if('children' in object){
    for(let uid in object['children']){
      child_obj = flattenDataSet(object['children'][uid], type);
      data_obj = Object.assign(data_obj, child_obj);
    }
  }

  return data_obj;
};

// the D3 normalization happens here.
const hashAndNormalizeMatrix = (matrix)=>{
  let data_obj = {};

  matrix.rows.forEach((row, row_index)=>{
    data_obj[matrix.row_names[row_index]] = {};
    row.forEach((datum, datum_index)=>{

      let row_id = matrix.row_names[row_index];
      data_obj[row_id][matrix.col_names[datum_index]] = datum;

      if(start_date_names.indexOf(matrix.rows[row_index][datum_index]) > -1){

        let date_index = matrix.col_names.indexOf('value');
        data_obj[row_id]['start'] = processValueForDate(row[date_index]);
      }

      if(end_date_names.indexOf(matrix.rows[row_index][datum_index]) > -1){

        let date_index = matrix.col_names.indexOf('value');
        data_obj[row_id]['end'] = processValueForDate(row[date_index]);
      }
    });
  });

  return data_obj;
};

const processData = (consignment_data)=>{
  let processed_data = {};
  let records = [];

  for(let key in consignment_data){
    if(key == 'record_name') continue;

    switch(key){
      case 'diagnostics':
      case 'prior_treatments':
      case 'treatments':
        // Extract the data objects from the consignment matrix.
        processed_data[key] = hashAndNormalizeMatrix(consignment_data[key]);

        // Group the data objects by their uids.
        processed_data[key] = nestDataset(
          processed_data[key],
          'uid',
          'parent_uid'
        );

        // Break out the objects into an array that D3 can use.
        for(let uid in processed_data[key]){
          processed_data[key][uid]['label'] = `${key} ${uid}`;
          processed_data[key][uid]['event_id'] = `${key}-${uid}-${Math.random()}`;
          processed_data[key][uid]['color'] = selectColor(key);
          processed_data[key][uid]['type'] = key;

          let flattened = flattenDataSet(processed_data[key][uid], key);
          if(flattened['start'] == flattened['end']) delete flattened['end'];
          records.push(flattened);
        }

        break;
      case 'prior_adverse_events':
      case 'adverse_events':

        if(consignment_data[key].rows.length <= 0) break;

        let data_obj = {};
        consignment_data[key].rows.forEach((row, row_index)=>{

          row.forEach((datum, datum_index)=>{

            let col_name = consignment_data[key].col_names[datum_index];
            data_obj[col_name] = datum;

            if(start_date_names.indexOf(col_name) > -1){
              data_obj['start'] = processValueForDate(datum);
            }

            if(end_date_names.indexOf(col_name) > -1){
              data_obj['end'] = processValueForDate(datum);
            }

            if(data_obj['start'] == data_obj['end']){
              delete data_obj['end'];
            }
          });

        });

        data_obj['label'] = `${key} ${Math.random()}`;
        data_obj['event_id'] = `${key}-${Math.random()}-${Math.random()}`;
        data_obj['color'] = selectColor(key);
        data_obj['type'] = key;

        records.push(data_obj);
        break;
    }
  }

  return records;
};

const mapStateToProps = (state = {}, own_props)=>{
  let records, selected_plot, selected_manifest, selected_consignment=undefined;

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
    records = processData(selected_consignment);
  }

  return {
    selected_consignment,
    selected_manifest,
    records
  };
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
