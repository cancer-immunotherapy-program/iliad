// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import {reviseDocument} from '../../actions/magma_actions';
import {formatDate} from '../../utils/dates';
import DateTimeInput from '../inputs/date_time_input';

export class DateTimeAttribute extends React.Component{
  renderEdit(){
    let {document, template, attribute, reviseDocument} = this.props;
    let input_props = {
      defaultValue: this.props.revision,
      onChange: (new_date)=>{
        reviseDocument(
          document,
          template,
          attribute,
          (new_date && new_date.toISOString())
        );
      }
    };

    return <DateTimeInput {...input_props} />;
  }

  renderValue(value){
    return <div className='value'>{formatDate(value)}</div>;
  }

  render(){
    let {value, mode} = this.props;
    return(
      <div className='value'>

        {(mode == 'edit') ? this.renderEdit() : this.renderValue(value)}
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

export const DateTimeAttributeContainer = ReactRedux.connect(
  null,
  mapDispatchToProps
)(DateTimeAttribute);
