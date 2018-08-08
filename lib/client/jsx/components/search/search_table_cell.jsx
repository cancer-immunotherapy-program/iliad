import * as React from 'react';
import AttributeViewer from '../attributes/attribute_viewer';

export default class SearchTableCell extends React.Component{

  render(){
    let {
      document,
      template,
      record_name,
      attr_name
    } = this.props;

    var attr_viewer = null;
    if(template.attributes[attr_name].attribute_class!='Magma::TableAttribute'){

      var attr_viewer_props = {
        'mode': this.props.mode,
        'template': template,
        'document': this.props.document,
        'value': document[attr_name],
        'attribute': template.attributes[attr_name]
      };

      attr_viewer = <AttributeViewer {...attr_viewer_props} />;
    }

    return(
      <td className='table-view-cell'>

        {attr_viewer}
      </td>
    );
  }
}
