import React from 'react';
import * as ReactRedux from 'react-redux';
var Noauth = React.createClass({
  componentDidMount: function () {
    this.props.message([
      "####",
      "Alas,", 
      this.props.user, 
      "--",
      "Though you seek to enter, you are *Unauthorized*." 
    ].join(" "))
  },
  render: function() {
    return <div className="noauth"/>
  }
})

Noauth = ReactRedux.connect(
  null,
  function(dispatch,props) {
    return {
      message: function(message) {
        dispatch(messageActions.showMessages([message]))
      }
    }
  }
)(Noauth)

Noauth.contextTypes = {
  store: React.PropTypes.object
}

module.exports = Noauth
