// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import {pushLocation} from '../../actions/location_actions';

class Link extends React.Component{
  setHistory(event){
    //event.preventDefault();
    this.props.pushLocation(this.props.link);
  }

  render(){
    let link_props = {
      className: 'link',
      onClick: this.setHistory.bind(this),
      href: this.props.link
    };

    return <a  {...link_props}>{this.props.name}</a>;
  }
}

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    pushLocation: (link)=>{
      dispatch(pushLocation(link));
    },
  };
};

export default ReactRedux.connect(
  null,
  mapDispatchToProps
)(Link);
