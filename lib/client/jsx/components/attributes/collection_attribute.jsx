// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import MagmaLink from '../general/magma_link';
import ListInput from '../inputs/list_input';

// Module imports.
import {reviseDocument} from '../../actions/magma_actions';

export default class CollectionAttribute extends React.Component{
  renderLinks(){
    let {value, attribute} = this.props;
    let links = value || [];

    return(
      <div className='collection'>
        {links.map((link)=>{
            return(
              <div key={link} className='collection_item'>

                <MagmaLink link={link} model={attribute.model_name} />
              </div>
            );
          }
        )}
      </div>
    );
  }

  render(){
    let {
      revision,
      mode,
      document,
      template,
      attribute,
      reviseDocument
    } = this.props;

    let input_props = {
      placeholder: 'New or existing ID',
      className: 'link_text',
      values: revision || [],
      onChange: (new_links)=>{
        reviseDocument(document, template, attribute, new_links);
      }
    };

    return(
      <div className='value'>

        {mode == 'edit' ? <ListInput {...input_props} /> : this.renderLinks()}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    reviseDocument: (doc, tmplt, attr, rev_val)=>{
      dispatch(reviseDocument(doc, tmplt, attr, rev_val));
    }
  };
};

export const CollectionAttributeContainer = ReactRedux.connect(
  null,
  mapDispatchToProps
)(CollectionAttribute);
