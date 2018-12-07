// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import Pager from './general/pager';
import AttributeViewer from './attributes/attribute_viewer';

import {requestTSV} from '../actions/magma_actions';
import {downloadCSV} from '../utils/csv';
import {
  selectModelTemplate,
  selectModelDocuments
} from '../selectors/magma_selector';

const TableCell = (template, document)=>{
  return (attr_name, index)=>{

    // If the attribute is an 'identifier' we make it a link.
    let attr = template.attributes[attr_name];
    if(template.identifier == attr_name){
      attr['attribute_class'] = 'LinkAttribute';
      attr['model_name'] = template.name;
    }

    let attr_props = {
      template,
      document,
      value: document[attr_name],
      attribute: attr
    };

    return(
      <td className='table-view-cell' key={`${attr_name}-${index}`}>

        <AttributeViewer {...attr_props} />
      </td>
    );
  }
};

const TableRow = (template, documents, attribute_names)=>{
  return (record_name, index)=>{
    return(
      <tr key={`${record_name}-${index}`} className='table-view-row'>

        {attribute_names.map(TableCell(template, documents[record_name]))}
      </tr>
    );
  };
};

class TableViewer extends React.Component{
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

    record_names = record_names.slice(
      page_size * current_page,
      page_size * (current_page+1)
    );

    return record_names.map(TableRow(template, documents, attribute_names));
  }

  renderHeader(){
    if(!this.props.attribute_names) return null;
    return(
      <tr>

        {this.props.attribute_names.map((attr_name, index)=>{
          return(
            <th key={index} className='table-view-header'>{attr_name}</th>
          );
        })}
      </tr>
    )
  }

  // Output the size of the table attribute.
  renderCounts(){
    let {documents, attribute_names} = this.props;
    let row_count = Object.keys(documents).length;
    let col_count = (attribute_names) ? attribute_names.length : 0;
    return(
      <div className='table-view-size'>

        <i className='fas fa-table'/>
        &nbsp;&nbsp;{`${row_count} rows x ${col_count} cols`}
      </div>
    );
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

    if(pages <= 1) return null;

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

    return <Pager {...pager_props} />;
  }

  renderButtons(){

    let export_props = {
      className: 'pager-export-btn',
      type: 'button',
      onClick: this.downloadMatrix.bind(this)
    };

    let upload_props = {
      className: 'pager-export-btn',
      type: 'button'
    };

    /*
     * Disabling the general table attribute download in lieu of a model level
     * download.
     */
    let download_elem = (
      <button {...export_props}>

        <i className='fas fa-download' aria-hidden='true'></i>
        &nbsp;{'DOWNLOAD'}
      </button>
    );

    let upload_elem = (
      <button {...upload_props}>

        <i className='fas fa-upload' aria-hidden='true'></i>
        &nbsp;{'UPLOAD'}
      </button>
    );

    /*
        return(
          <Pager {...pager_props}>

            {download_elem}
            {(this.props.mode == 'edit') ? upload_elem : null}
          </Pager>
        );
    */

    return(
      <div style={{display: 'inline'}}>

        {(this.props.mode == 'edit') ? upload_elem : null}
      </div>
    );
  }

  renderTable(){
    return(
      <div className='table-view-group'>

        <table className='table-view'>
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

  render(){
    let docs = this.props.documents;
    return(
      <div>

        {this.renderCounts()}
        {this.renderPager()}
        {this.renderButtons()}
        {(Object.keys(docs).length > 0) ? this.renderTable() : null}
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
    model_name: own_props.model_name,
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
