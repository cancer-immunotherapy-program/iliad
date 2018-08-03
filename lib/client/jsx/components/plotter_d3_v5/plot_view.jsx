// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

export class PlotView extends React.Component{
  constructor(props){
    super(props);
  }
  
  render(){
    return(
      <div> hello from plot view! </div>
    )
  }
}

const mapStateToProps = state => {
  return{}
};

const mapDispatchToProps = dispatch => {
  return{

  }
};

export const PlotViewContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(PlotView);