// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import {reviseDocument} from '../../actions/magma_actions';

class DocumentAttribute extends React.Component{
  revise(e) {
    let { document, template, attribute, reviseDocument } = this.props;

    reviseDocument(
      document,
      template,
      attribute,
      e.target.files[0]
    )
  }
  renderEdit(){
    let {document, template, attribute, reviseDocument} = this.props;
    let input_props = {
      onChange: function(event){
        reviseDocument({
          document,
          template,
          attribute,
          revised_value: event.target.files[0]
        });
      },
      type: 'file'
    };

    return(
      <div className="value">

        <input {...input_props}/>
      </div>
    );
  }

  render(){
    if(this.props.mode == 'edit') return this.renderEdit();

    if(this.props.value){
      return(
        <div className='value'>

          <a href={this.props.value.url}>

            {this.props.value.path}
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
    reviseDocument: (args)=>{
      dispatch(MagmaActions.reviseDocument(args));
    }
  };
};

export default ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentAttribute);
