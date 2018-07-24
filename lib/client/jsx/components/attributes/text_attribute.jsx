// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import * as MagmaActions from '../../actions/magma_actions';
import TextAreaInput from '../inputs/text_area_input';

export default class TextAttribute extends React.Component{
  renderEdit(){
    let {revision, document, template, attribute, reviseDocument} = this.props;
    let input_props = {
      defaultValue: revision,
      className: 'text_box',
      onChange: (value)=>{
        reviseDocument({
          document,
          template,
          attribute,
          revised_value: value
        });
      }
    };

    return <TextAreaInput {...input_props} />;
  }

  render(){
    return(
      <div className='value'>

        {this.props.mode == 'edit' ? this.renderEdit() : this.props.value}
      </div>
    );
  }
}

const mapStateToProps = (dispatch, own_props)=>{
  return {};
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    reviseDocument: (args)=>{
      dispatch(MagmaActions.reviseDocument(args));
    }
  };
};

export const TextAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(TextAttribute);
