import React from 'react';
var MagmaLink = React.createClass({
  render: function(){

    var link_props = {
      'className': 'link',
      'href': '/'+PROJECT_NAME+'/browse/'+this.props.model+'/'+encodeURIComponent(this.props.link)
    };

    return(
      <a {...link_props}>

        {this.props.link}
      </a>
    );
  }
});

module.exports = MagmaLink;
