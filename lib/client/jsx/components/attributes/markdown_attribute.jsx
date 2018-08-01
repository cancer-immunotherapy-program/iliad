// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Module imports.
import {reviseDocument} from '../../actions/magma_actions';
import markdown from '../../utils/markdown';

export class MarkdownAttribute extends React.Component{
  renderEdit(){
    let {document, template, attribute, reviseDocument} = this.props;
    let textarea_props = {
      className: 'text_box',
      onChange: function(event){
        reviseDocument(document, template, attribute, event.target.value);
      },
      defaultValue: this.props.revision
    };

    return(
      <div className='value'>

        <textarea {...textarea_props} />
      </div>
    );
  }

  render(){
    if(this.props.mode == 'edit') return this.renderEdit();
    if(!this.props.value) return <div className='value' />

    let content = markdown(this.props.value);
    return <div className='value' dangerouslySetInnerHTML={{__html: content}}/>;
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

export const MarkdownAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(MarkdownAttribute);
