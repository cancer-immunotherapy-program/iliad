// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Module imports.
import {requestDictionaries} from '../../actions/magma_actions';
import {
  selectDictionaryByModel,
  selectModelDocuments,
  selectModelTemplate,
} from '../../selectors/magma_selector';

export class ClinicalAttribute extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div>

        {'Generic Clinical Attribute'}
      </div>
    );
  }
}

const mapStateToProps = (state, own_props)=>{

  let args = [
    state,
    APP_CONFIG.project_name,
    own_props.attribute.model_name
  ];

  let documents = selectModelDocuments(...args);

  return {
    documents,
    dictionary: selectDictionaryByModel(...args),
    template: selectModelTemplate(...args),
    record_names: Object.keys(documents).sort()
  };
};

export const ClinicalAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  {}
)(ClinicalAttribute);
