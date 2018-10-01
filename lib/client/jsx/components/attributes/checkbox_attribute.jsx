// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import {reviseDocument} from '../../actions/magma_actions';

export class CheckboxAttribute extends React.Component{
  renderEdit(){
    let {document, template, attribute, reviseDocument} = this.props;
    let input_props = {
      type: 'checkbox',
      className: 'text_box',
      onChange:function(event){
        reviseDocument(
           document,
           template,
           attribute,
           (event.target.checked ? true : false)
        );
      },
      defaultChecked: this.props.revision
    };

    return(
      <div className='value'>

        <input {...input_props} />
      </div>
    );
  }

  render(){
    if (this.props.mode == 'edit') return this.renderEdit();
    return(
      <div className='value'>

        {this.props.value ? 'yes' : 'no'}
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

export const CheckboxAttributeContainer = ReactRedux.connect(
  null,
  mapDispatchToProps
)(CheckboxAttribute);
