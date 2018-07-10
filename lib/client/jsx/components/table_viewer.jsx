import { connect } from 'react-redux';
import React from 'react';

import Pager from './pager';
import {HelpContainer as Help} from './help';
import AttributeViewer from './attributes/attribute_viewer';

import {requestTSV} from '../actions/magma_actions';
import {
  selectModelTemplate,
  selectModelDocuments
} from '../selectors/magma_selector';

const TableColumn = (template, document) => (att_name) => (
    <div className='table_data' key={att_name}>
      <AttributeViewer 
        template={ template }
        document={ document }
        value={ document[ att_name ] }
        attribute={ template.attributes[att_name] }/>
    </div>
);

const TableRow = (template, documents, attribute_names) => (record_name) => (
  <div key={ record_name } className='table_row'>
  {
    attribute_names.map(TableColumn(template, documents[record_name]))
  }
  </div>
);

class TableViewer extends React.Component {
  renderPager() {
    let { pages, current_page, setPage, onFilter, model_name, record_names } = this.props;

    return(
      <Pager pages={ pages } 
        current_page={ current_page + 1 }
        setPage={ setPage } >
        <div className='search'>&#x2315;</div>
        <input className='filter' type='text' onChange={ (e) => onFilter(e.target.value) }/>
        <input className='export' type='button' onClick={ () => requestTSV(model_name, record_names) } value={'\u21af TSV'}/>
        <Help info='table_viewer'/>
      </Pager>
    );
  }

  renderRecords() {
    let { template, documents, record_names, attribute_names, page_size, current_page } = this.props;

    if (!record_names.length) return <div>No entries</div>;

    return(
      record_names.slice(page_size * current_page, page_size * (current_page+1)).map(
        TableRow(template, documents, attribute_names)
      )
    );
  }

  renderHeader() {
    let { attribute_names } = this.props;

    return(
      <div className='table_row'>
      {
        attribute_names.map((att_name,i) => 
          <div key={i} className='table_header'>{ att_name }</div>
        )
      }
      </div>
    );
  }

  render() {
    let { template } = this.props;

    if (!template) return <div/>;

    return(
      <div className='table'>
        { this.renderPager() }
        { this.renderHeader() }
        { this.renderRecords() }
      </div>
    );
  }
}

export default connect(
  function(state, props){

    let prj_nm = APP_CONFIG.project_name;
    let template = selectModelTemplate(state, prj_nm, props.model_name);
    let documents = selectModelDocuments(
      state,
      prj_nm,
      props.model_name,
      props.record_names
    );

    let record_names = Object.keys(documents).sort();
    let pages = Math.ceil(record_names.length / props.page_size);

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
  },
  { requestTSV }
)(TableViewer);
