import * as React from 'react';
import ConsignmentResult from './consignment_result';

export default class ConsignmentView extends React.Component{
  renderData(consignment){
    let elems = Object.keys(consignment).map((name, index)=>{
      if(consignment[name] == 'macro') return null;
      return(
        <div key={index} className='consignment-result-group'>

          <div className='consignment-variable-name'>@{name}:&nbsp;&nbsp;</div>
          <ConsignmentResult name={name} data={consignment[name]}/>
        </div>
      );
    });

    return elems.filter(_=>_);
  }

  render(){
    let {consignment} = this.props;
    if(!consignment) return null;

    return(
      <div className='consignment-group'>

        <div className='consignment-label'>Results:</div>
        <div className='consignment-top-table-group'>

          {this.renderData(consignment)}
        </div>
      </div>
    );
  }
}
