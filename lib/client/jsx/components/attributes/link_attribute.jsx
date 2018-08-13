// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import SlowTextInput from '../inputs/slow_text_input';
import MagmaLink from '../general/magma_link';
import {reviseDocument} from '../../actions/magma_actions';

export class LinkAttribute extends React.Component{
  renderEdit(){
    let {document, template, attribute, reviseDocument} = this.props;
    let link_props = {
      className: 'delete_link',
      onClick: function(event){
        reviseDocument(document, template, attribute, null);
      }
    };

    if(this.props.revision && this.props.revision == this.props.value){
      return(
        <div className='value'>

          <span {...link_props}>

            {this.props.revision}
          </span>
        </div>
      );
    }

    let input_props = {
      className: 'link_text',
      waitTime: 500,
      onChange: (value)=>{
        reviseDocument(document, template, attribute, value);
      },
      placeholder:'New or existing ID',
      defaultValue: ''
    };

    return(
      <div className='value'>

        <SlowTextInput {...input_props} />
      </div>
    );
  }

  render(){
    if (this.props.mode == 'edit') return this.renderEdit();

    let {value, attribute} = this.props;
    if(value){
      return(
        <div className='value'>

          <MagmaLink link={value} model={attribute.model_name} />
        </div>
      );
    }

    return <div className='value' />;
  }
}

const mapStateToProps = (dispatch, own_props)=>{
  return {};
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    reviseDocument: (doc, tmplt, attr, rev_val)=>{
      dispatch(reviseDocument(doc, tmplt, attr, rev_val));
    }
  };
};

export const LinkAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(LinkAttribute);
