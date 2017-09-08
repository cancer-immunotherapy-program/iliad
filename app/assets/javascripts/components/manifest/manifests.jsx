import React, { Component } from 'react'
import * as ReactRedux from 'react-redux';
import { requestManifests } from '../../actions/manifest_actions'
import ManifestSelector from './manifest_selector'
import debounce from 'lodash.debounce'

// Main component for viewing/editing manifests
class Manifests extends Component {
  componentDidMount() {
    this.props.requestManifests();
  }

  renderManifest(){
    var manifestProps = {
      'currentUser': this['props']['currentUser'],
      'manifest': this['props']['manifest'],
      'projectName': this['props']['projectName']
    };

    if(this['props']['isEditing']){

      manifestProps['isAdmin'] = this['props']['isAdmin'];
      return <ManifestForm {...manifestProps} />;
    }
    else{

      if(this['props']['selectedManifest']){
        
        return <ManifestView {...manifestProps} />;
      }
      else{

        return null;
      }
    }
  }

  render(){
    var {manifests, selectedManifest} = this['props'];
    var selectorProps = {
      'manifests': manifests,
      'isEditing': this['props']['isEditing']
    };

    return(
      <div id='manifest-group'>

        <ManifestSelector {...selectorProps} />
        {this.renderManifest()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps)=>{
  const {manifests, 'manifestsUI': {selected, isEditing}} = state;
  return {
    'manifests': manifests,
    'selectedManifest': selected,
    'manifest': manifests[selected],
    isEditing
  };
};

const mapDispatchToProps = (dispatch, ownProps)=>{
  return {
    requestManifests: function(projectName){
      dispatch(requestManifests(projectName));
    }
  };
};

export default ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(Manifests);


/*
const mapStateToProps = (state) => {
  const { manifests, manifestsUI: { selected, isEditing } } = state
  return {
    manifests: manifests,
    selectedManifest: selected,
    manifest: manifests[selected],
    isEditing
  }
}

export default connect(mapStateToProps, {
  requestManifests
})(Manifests)
*/

