// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import Pager from './general/pager';
import {HelpContainer as Help} from './help';
import AttributeViewer from './attributes/attribute_viewer';

import {requestTSV} from '../actions/magma_actions';
import {downloadCSV} from '../utils/csv';
import {
  selectModelTemplate,
  selectModelDocuments
} from '../selectors/magma_selector';

const TableCell = (template, document)=>{
  return (attr_name)=>{
    let attr_props = {
      template,
      document,
      value: document[attr_name],
      attribute: template.attributes[attr_name]
    };

    return(
      <td className='table-viewer-cell' key={attr_name}>

        <AttributeViewer {...attr_props} />
      </td>
    );
  }
};

const TableRow = (template, documents, attribute_names)=>{
  return (record_name)=>{
    return(
      <tr key={record_name} className='table-viewer-row'>

        {attribute_names.map(TableCell(template, documents[record_name]))}
      </tr>
    );
  };
};

class TableViewer extends React.Component{

/*
  downloadTSV(event){
    this.props.requestTSV(
      this.props.model_name,
      null,
      this.props.record_names
    );
  }
*/

  downloadMatrix(){
    let data = Object.keys(this.props.documents).map((id)=>{
      return this.props.documents[id];
    });

    downloadCSV(
      data,
      this.props.attribute_names,
      `${APP_CONFIG.project_name}_${this.props.model_name}`
    );
  }

  renderRecords(){
    let {
      template,
      documents,
      record_names,
      attribute_names,
      page_size,
      current_page
    } = this.props;

    if (!record_names.length) null;

    record_names = record_names.slice(
      page_size * current_page,
      page_size * (current_page+1)
    );

    return record_names.map(TableRow(template, documents, attribute_names));
  }

  renderHeader(){
    if(!this.props.attribute_names) return null;
    return(
      <tr className='table-viewer-row'>

        {this.props.attribute_names.map((attr_name, index)=>{
          return(
            <th key={index} className='table-viewer-header'>{attr_name}</th>
          );
        })}
      </tr>
    )
  }

  renderPager(){
    let {
      pages,
      current_page,
      setPage,
      onFilter,
      model_name,
      record_names
    } = this.props;

    let pager_props = {
      pages: pages,
      current_page: current_page + 1,
      setPage: setPage
    };

    let filter_props = {
      className: 'pager-filter-input',
      type: 'text',
      onChange: (e)=>{
        onFilter(e.target.value);
      }
    };

    let export_props = {
      className: 'pager-export-btn',
      type: 'button',
      onClick: this.downloadMatrix.bind(this),
      value: '\u21af TSV'
    };

    /*
     * This is not being included in the display until we can make sure the
     * filtering works properly.
     */
    let filter_elem = (
      <div className='pager-filter-group'>

        <div className='pager-filter-search-icon'>

          <span className='fas fa-search'></span>
        </div>
        <input {...filter_props} />
      </div>
    );

    let download_elem = (
      <button {...export_props}>

        <i className='fas fa-download' aria-hidden='true' ></i>
        &nbsp;{'DOWNLOAD'}
      </button>
    );

    return(
      <Pager {...pager_props}>

        {download_elem}
      </Pager>
    );
  }

  render(){
    if(!this.props) return null;
    return(
      <div className='table-viewer-group'>

        {this.renderPager()}
        <table>
          <thead>

            {this.renderHeader()}
          </thead>
          <tbody>

            {this.renderRecords()}
          </tbody>
        </table>
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
    requestTSV: (model_names, filter, record_names)=>{
      dispatch(requestTSV(model_names, filter, record_names));
    }
  };
};

export const TableViewerContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(TableViewer);
