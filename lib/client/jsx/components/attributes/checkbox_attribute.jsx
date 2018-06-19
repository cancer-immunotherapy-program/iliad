// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import {reviseDocument} from '../../actions/magma_actions';

class CheckboxAttribute extends React.Component{
  revise(e) {
    let { document, template, attribute, reviseDocument } = this.props;

    reviseDocument(
      document,
      template,
      attribute,
      e.target.checked ? true : false
    );
  }

  renderEdit(){
    let {document, template, attribute, reviseDocument} = this.props;
    let input_props = {
      type: 'checkbox',
      className: 'text_box',
      onChange:function(event){
        reviseDocument({
           document,
           template,
           attribute,
           revised_value: event.target.checked ? true : false
        })
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

export default ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckboxAttribute);
