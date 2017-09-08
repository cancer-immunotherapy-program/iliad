import * as React from 'react';
import * as ReactRedux from 'react-redux';

import {toggleEdit, selectManifest} from '../../actions/manifest_actions';

class ManifestSelector extends React.Component{

  renderManifestEntries(manifests){

    return manifests.map((manifest)=>{

      var manifestProp = {
        'className': 'manifest-selection',
        'title': manifest['description'],
        'key': 'manifest-'+manifest['id'],
        'onClick': ()=>{
          if(this['props']['isEditing']) this['props'].toggleEdit();
          this['props'].selectManifest(manifest['id']);
        }
      };

      return(
        <div {...manifestProp}>

          {manifest['name']}
        </div>
      );
    });
  }

  render(){
    var newManifestButtonProps = {
      'id': 'manifest-selector-new-btn',
      'onClick': ()=>{
        this['props'].selectManifest(null);
        this['props'].toggleEdit();
      }
    };

    return(
      <div id='manifests-selector-group'>

        <button {...newManifestButtonProps}>

          <i className='fa fa-plus' aria-hidden='true'></i>
          {' NEW MANIFEST'}
        </button>
        <div id='manifests-selector-panel'>

          <div className='manifest-selector-header'>

            {'PUBLIC'}
          </div>
          {this.renderManifestEntries(this['props']['publicManifests'])}
          <div className='manifest-selector-header'>

            {'PRIVATE'}
          </div>
          {this.renderManifestEntries(this['props']['privateManifests'])}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps)=>{
  var publicFilter = (m)=> m['access'] == 'public';
  var privateFilter = (m)=> m['access'] == 'private';
  var sortFunction = (a, b)=> a > b;

  return {
    'publicManifests': Object.values(ownProps['manifests'])
      .filter(publicFilter)
      .sort(sortFunction),
    'privateManifests': Object.values(ownProps['manifests'])
      .filter(privateFilter)
      .sort(sortFunction)
  };
};

const mapDispatchToProps = (dispatch, ownProps)=>{
  return {
    'selectManifest': function(id){
      dispatch(selectManifest(id));
    },

    'toggleEdit': function(){
      dispatch(toggleEdit());
    }
  };
};

export default ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(ManifestSelector);



/*
// Selection item for a single manifest
const ManifestSelection = (selectManifest) => (manifest) => {
  return <li key={manifest.id}>
    <div className='manifest-selection'>
      <a href='#' 
        onClick={
          () => selectManifest(manifest.id) 
        }
        title={ manifest.description }>
        <span className='name'>{manifest.name}</span>
      </a>
    </div>
  </li>
}

// Collection of selection items for all manifests
class ManifestSelector extends Component {
  render() {
    let { public_manifests, private_manifests } = this.props
    return <div className='manifests-selector'>
      <a href='#' onClick={ () => this.props.selectManifest(null) && this.props.toggleEdit() } className="new">
        <i className="fa fa-plus" aria-hidden="true"></i>
        New Manifest
      </a>
      <div>
      <span className="title">Public</span>
      <ol>
        {
          public_manifests.map(ManifestSelection(this.props.selectManifest))
        }
      </ol>
      <span className="title">Private</span>
      <ol>
        {
          private_manifests.map(ManifestSelection(this.props.selectManifest))
        }
      </ol>
      </div>
    </div>
  }
}

export default connect(
  (state, props) => {
    return {
      public_manifests: Object.values(props.manifests).filter((m) => m.access == 'public').sort((a,b) => a > b),
      private_manifests: Object.values(props.manifests).filter((m) => m.access == 'private').sort((a,b) => a > b),
    }
  },
  { toggleEdit, selectManifest }
)(ManifestSelector)

*/