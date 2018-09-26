import React from 'react';
import {TableViewerContainer as TableViewer} from '../table_viewer';

export default class TableAttribute extends React.Component{
  constructor(props){
    super(props)
    this.state = {filter: '', current_page: 0};
  }

  render(){
    let table_props = {
      page_size: 10,
      current_page: this.state.current_page,
      setPage: (page)=>{
        this.setState({current_page: page-1});
      },
      filter: this.state.filter,
      onFilter: (filter)=>{
        this.setState({current_page: 0, filter});
      },
      model_name: this.props.attribute.model_name,
      record_names: this.props.value,
      mode: this.props.mode
    };

    return(
      <div className='value'>

        <TableViewer {...table_props} />
      </div>
    );
  }
}
