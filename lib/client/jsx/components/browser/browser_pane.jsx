// Framework libraries.
import * as React from 'react';

// Class imports.
import AttributeViewer from '../attributes/attribute_viewer';

export default class BrowserPane extends React.Component{
  constructor(props){
    super(props);
  }

/*
  renderTitle(){
    let {title, name} = this.props.pane;
    if(title) return <div className='title' title={name}>{title}</div>;
    return null;
  }
*/

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

  renderAttribute(attr_props){
    let attr_name = attr_props.attribute.name;
    let attr_val = attr_props.document[attr_name];

    // If there is no data for this attribute then we render a '-'.
    if(attr_val == null || attr_val.length == 0){
      attr_props.attribute['attribute_class'] = 'Magma::Attribute';
      attr_props.attribute['type'] = 'String';
      attr_props.value = '-';
    }

    return <AttributeViewer {...attr_props} />;
  }

  renderBrowserAttributes(){
    let {template, doc, revision, pane, mode} = this.props;
    let display = Object.keys(pane.attributes).map((attr_name, index)=>{

      // Return null if we are not to show the attribute.
      if(pane.attributes[attr_name].shown === false) return null;

      if (mode == 'edit' && !pane.attributes[attr_name].editable) return null;

      // The App view attribute.
      let attr = pane.attributes[attr_name];

      // The data of the attribute
      let value = doc[attr_name];

      // Setting the edit mode and revision of the attribute.
      let revised_value = doc[attr_name];
      if(attr_name in revision) revised_value = revision[attr_name];

      // Set a boolean as to whether this document is currently under revision.
      let revised = (mode == 'edit' && value != revised_value);

      let attr_viewer_props = {
        template,
        value,
        mode,
        attribute: attr,
        document: doc,
        revision: revised_value
      };

      return(
        <div className='browser-attribute'>

          <div className='browser-name'>

            {(attr.display_name == null) ? attr.title : attr.display_name}
          </div>
          <div className='browser-value'>

            {this.renderAttribute(attr_viewer_props)}
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
