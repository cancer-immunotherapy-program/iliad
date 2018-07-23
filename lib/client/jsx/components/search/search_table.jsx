// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import {
  selectModelDocuments,
  selectModelTemplate
} from '../../selectors/magma_selector';

// exclude things not shown and tables

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

/*
  focusCell(row, column) {
    if (column == null) return (row == this.state.focus_row)
    if (row == null) return (column == this.state.focus_col)
    this.setState({ focus_row: row, focus_col: column })
  }
*/

  renderCells(document){
    var props = this.props;
    return props.attribute_names.map((attr_name, index)=>{
      return(
        <td className='search-table-cell' key={index}>

          {document[attr_name]}
        </td>
      );
    });
  }

  renderRows(){
    return this.props.record_names.map((record_name, index)=>{
      return(
        <tr className='search-table-row' key={index}>

          {this.renderCells(this.props.documents[record_name])}
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
