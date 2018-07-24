// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import SearchTableCell from './search_table_cell';

import {
  selectModelDocuments,
  selectModelTemplate
} from '../../selectors/magma_selector';

// Exclude things not shown and tables.
const displayedAttributes = (template)=>{
  return Object.keys(template.attributes).filter((attribute_name)=>{
    return(
      template.attributes[attribute_name].shown &&
      template.attributes[attribute_name].attribute_class != 'Magma::TableAttribute'
    );
  });
};

export class SearchTable extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  focusCell(row, column){
    if(column == null) return (row == this.state.focus_row);
    if(row == null) return (column == this.state.focus_col);
    //this.setState({focus_row: row, focus_col: column});
  }

  renderCells(document, record_name){
    return this.props.attribute_names.map((attr_name, index)=>{

      let table_cell_props = {
        key: attr_name,
        attr_name,
        document,
        template: this.props.template,
        record_name,
        mode: this.props.mode
      };

      return <SearchTableCell {...table_cell_props} />;
    });
  }

  renderRows(){
    return this.props.record_names.map((record_name, index)=>{
      return(
        <tr className='search-table-row' key={index}>

          {this.renderCells(
            this.props.documents[record_name],
            record_name
          )}
        </tr>
      );
    });
  }

  renderHeader(){
    return this.props.attribute_names.map((attr_name, index)=>{
      return <th className='search-table-header' key={index}>{attr_name}</th>;
    });
  }

  render(){
    let {record_names, documents, template, attribute_names, mode} = this.props;
    if (!record_names) return null;
    return(
      <table className='search-table'>

        <thead>

          <tr>

            {this.renderHeader()}
          </tr>
        </thead>
        <tbody>

          {this.renderRows()}
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  if(!own_props.model_name) return {};

  let documents = selectModelDocuments(
    state,
    APP_CONFIG.project_name,
    own_props.model_name,
    own_props.record_names
  );

  let template = selectModelTemplate(
    state,
    APP_CONFIG.project_name,
    own_props.model_name
  );

  let attribute_names = displayedAttributes(template);

  return {
    template,
    attribute_names,
    documents
  };
};

export const SearchTableContainer = ReactRedux.connect(
  mapStateToProps,
  {}
)(SearchTable);
