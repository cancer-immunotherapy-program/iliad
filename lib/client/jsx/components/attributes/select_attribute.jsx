// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import SelectInput from '../inputs/select_input';
import {reviseDocument} from '../../actions/magma_actions';

export class SelectAttribute extends React.Component{
  renderEdit(){
    let {value, document, template, attribute, reviseDocument} = this.props;
    let input_props = {
      className: 'selection',
      onChange: function(value){
        reviseDocument(document, template, attribute, value);
      },
      defaultValue: value,
      showNone: 'disabled',
      values: attribute.options
    };

    return(
      <div className='value'>

        <SelectInput {...input_props} />
      </div>
    );
  }

  render(){
    if (this.props.mode == 'edit') return this.renderEdit();
    return <div className='value'>{this.props.value}</div>;
  }
}

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    reviseDocument: (doc, tmplt, attr, rev_val)=>{
      dispatch(reviseDocument(doc, tmplt, attr, rev_val));
    }
  };
};

export const SelectAttributeContainer = ReactRedux.connect(
  null,
  mapDispatchToProps
)(SelectAttribute);
