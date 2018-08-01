// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import {reviseDocument} from '../../actions/magma_actions';

export default class ImageAttribute extends React.Component{
  renderEdit(){
    let {document, template, attribute, reviseDocument} = this.props;
    let input_props = {
      onChange: (event)=>{
        reviseDocument(document, template, attribute, e.target.files[0]);
      },
      type: 'file'
    };

    return(
      <div className='value'>

        <input {...input_props} />
      </div>
    );
  }

  render(){
    if(this.props.mode == 'edit') return this.renderEdit();

    if(this.props.value){
      return(

        <div className='value'>

          <a href={this.props.value.url}>

            <img src={this.props.value.thumb} />
          </a>
        </div>
      );
    }

    return(
      <div className='value'>

        <div className='document_empty'>

          {'No file.'}
        </div>
      </div>
    );
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

export const ImageAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageAttribute);
