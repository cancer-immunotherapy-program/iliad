import * as React from 'react';
import {manifestResult} from './manifest_result';

export default class ConsignmentView extends React.Component{
  renderData(consignment){
    let elems = Object.keys(consignment).map((name, index)=>{
      if(consignment[name] == 'macro') return null;
      return(
        <div key={index} className='consignment-result'>

          <div className='consignment-variable-name'>@{name}:</div>
          {manifestResult(name, consignment[name])}
        </div>
      );
    });

    return elems.filter(_=>_);
  }

  render(){
    let {consignment} = this.props;
    if(!consignment) return null;

    return(
      <div className='consignment-view'>

        <div className='consignment-label'>Results:</div>
        {this.renderData(consignment)}
      </div>
    );
  }
}
