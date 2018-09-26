// Framework libraries.
import * as React from 'react';
import {downloadCSV} from '../../utils/csv';
import {isPrimitiveType} from '../../utils/types';
import ConsignmentTable from './consignment_table';

class VectorResult extends React.Component{
  constructor(props){
    super(props);
    this.state = {hidden: true};
  }

  toggle(){
    this.setState({hidden: !this.state.hidden});
  }

  downloadVector(){
    let vectors = this.props.vector.map((label, value)=>{
      return {label, value};
    });

    downloadCSV(
      vectors,
      ['label', 'value'],
      this.props.name
    );
  }

  table(){
    let {vector} = this.props;
    let headers = ['Labels', 'Values'];
    let rows = vector.map((label, value)=>[
      label,
      isPrimitiveType(value) ? value : <ConsignmentResult data={value} />
    ]);

    return <ConsignmentTable headers={headers} rows={rows} />;
  }

  render(){
    let {vector} = this.props;
    let {hidden} = this.state;
    return(
      <div className='consignment-vector-group'>

        <div className='consignment-table-size'>

          <i className='fas fa-table' />
          &nbsp;&nbsp;{`${vector.size} elements`}
        </div>
        <button className='consignment-btn' onClick={this.downloadVector.bind(this)}>

          <i className='fas fa-download' aria-hidden='true' ></i>
          &nbsp;{'DOWNLOAD'}
        </button>
        <button className='consignment-btn' onClick={this.toggle.bind(this)}>

          <i className='fas fa-table' aria-hidden='true'></i>
          &nbsp;{ hidden ? 'SHOW' : 'HIDE'}
        </button>
        {!hidden && this.table()}
      </div>
    );
  }
}

export default VectorResult;
