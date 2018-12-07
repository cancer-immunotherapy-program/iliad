// Framework libraries.
import * as React from 'react';

// Class imports.
import AttributeViewer from '../attributes/attribute_viewer';

export default class BrowserPane extends React.Component{
  constructor(props){
    super(props);
  }

  renderTitle(){
    let {title, name} = this.props.pane;

    if(title){
      return(
        <div className='title' title={name}>

          <div className='title-group'>

            {title}
          </div>
        </div>
      );
    }

    return null;
  }

  renderBrowserAttributes(){
    let {template, doc, revision, pane, mode} = this.props;
    let display = Object.keys(pane.attributes).map((attr_name, index)=>{

      // The App view attribute.
      let attr = pane.attributes[attr_name];

      // The data of the attribute
      let value = doc[attr_name];

      let attr_viewer_props = {
        template,
        value,
        mode,
        attribute: attr,
        document: doc,
        revision: null,//revised_value,
        key: `browser-value-${index}`
      };

      return(
        <div className='browser-attribute' key={`browser-attribute-${index}`}>

          <div className='browser-name'>

            {(attr.display_name == null) ? attr.title : attr.display_name}
          </div>
          <div className='browser-value'>

            <AttributeViewer {...attr_viewer_props} />
          </div>
        </div>
      );
    });

    return display;
  }

  render(){
    if(Object.keys(this.props.pane.attributes).length == 0){
      return <div style={{'display': 'none'}} />;
    }

    return(
      <div className='browser-pane'>

        {this.renderTitle()}
        <div className='browser-attributes'>

          {this.renderBrowserAttributes()}
        </div>
      </div>
    );
  }
}
