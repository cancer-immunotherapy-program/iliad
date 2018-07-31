// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import {dismissMessages} from '../../actions/app_actions';

export class Messenger extends React.Component{
  constructor(props){
    super(props);
  }

  render(){

    let msngr_props = {
      className: 'messenger-group',
      style: {
        display: (this.props.messages.length > 0) ? 'block' : 'none'
      }
    };

    let dismiss_props = {
      className: 'messenger-dismiss-btn',
      onClick: this.props.dismissMessages,
      title: 'Dismiss message.'
    };

    return(
      <div {...msngr_props}>

        <button {...dismiss_props}>

          <i className='fas fa-times'></i>
        </button>
        {this.props.messages.map((message, index)=>{
          return <div className='message' key={index}>{message}</div>;
        })}
      </div>
    );
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
