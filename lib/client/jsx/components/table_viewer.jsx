// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import Pager from './pager';

import {requestTSV} from '../actions/magma_actions';
import {
  selectModelTemplate,
  selectModelDocuments
} from '../selectors/magma_selector';

const TableColumn = (template, document)=>{
  return (attr_name)=>{
    let attr_props = {
      template,
      document,
      value: document[attr_name],
      attribute: template.attributes[attr_name]
    };

    return(
      <div className='table_data' key={attr_name}>

        {document[attr_name]}
      </div>
    );
  };
};

const TableRow = (template, documents, attribute_names)=>{
  return (record_name)=>{
    return(
      <div key={record_name} className='table_row'>

        {attribute_names.map(TableColumn(template, documents[record_name]))}
      </div>
    );
  };
};

class TableViewer extends React.Component{

  renderRecords(){
    let {
      template,
      documents,
      record_names,
      attribute_names,
      page_size,
      current_page
    } = this.props;

    if (!record_names.length) return <div>No entries</div>;

    return record_names.map(
      TableRow(template, documents, attribute_names)
    );
  }

  renderHeader() {
    let { attribute_names } = this.props;

    return(
      <div className='table_row'>

        {attribute_names.map((att_name, index)=>{
          return <div key={index} className='table_header'>{att_name}</div>;
        })}
      </div>
    );
  }

  render(){
    if (!this.props.template) return null;
    return(
      <div className='table'>

        {this.renderHeader()}
        {this.renderRecords()}
      </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  let prj_nm = APP_CONFIG.project_name;
  let template = selectModelTemplate(state, prj_nm, own_props.model_name);
  let documents = selectModelDocuments(
    state,
    prj_nm,
    own_props.model_name,
    own_props.record_names
  );

  let record_names = Object.keys(documents).sort();
  let pages = Math.ceil(record_names.length / own_props.page_size);

  let attribute_names = null;
  if(template){
    attribute_names = Object.keys(template.attributes).filter((attr_name)=>{
      let attr = template.attributes[attr_name];
      return (attr.shown && attr.attribute_class != 'Magma::TableAttribute');
    });
  }

  return {
    template,
    documents,
    record_names,
    pages,
    attribute_names
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    requestTSV: (model_name, record_names)=>{
      dispatch(requestTSV(model_name, record_names));
    }
  };
};

export const TableViewerContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(TableViewer);
