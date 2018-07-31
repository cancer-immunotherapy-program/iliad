// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import {dismissMessages} from '../../actions/app_actions';

export class Messenger extends React.Component{
  constructor(props){
    super(props);
    this.state = {current_message: 0};
  }

  render(){

    if(this.props.messages.length > 0){
      console.log(this.props.messages);
    }
    return <div />;
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  return {
    messages: (state.app.messages) ? state.app.messages : []
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    dismissMessages: ()=>{
      dispatch(dismissMessages());
    }
  };
}

export const MessengerContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(Messenger);
