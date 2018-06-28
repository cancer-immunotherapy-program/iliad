// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Module imports.
import {addTokenUser} from '../../actions/app_actions';

export class SettingsUser extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  componentDidMount(){
    this.props.fetchUserSettings();
  }
  
  render(){
    if(this.props.token_user){
      return <pre>{JSON.stringify(this.props.token_user, null, 2)}</pre>;
    }
    else{
      return null;
    }
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  if(state.app.user === undefined) return {};
  return {token_user: state.app.user};
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    fetchUserSettings: ()=>{
      dispatch(addTokenUser());
    }
  };
};

export const SettingsUserContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsUser);
