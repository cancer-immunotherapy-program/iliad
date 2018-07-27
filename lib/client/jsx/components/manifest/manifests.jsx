// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import md5 from 'md5';

// Class imports.
import ListMenu from '../general/list_menu';
import {ManifestViewContainer as ManifestView}  from './manifest_view';

// Module imports.
import {addTokenUser} from '../../actions/app_actions';
import {
  requestManifests,
  saveNewManifest,
  saveManifest,
  copyManifest,
  deleteManifest
} from '../../actions/manifest_actions';
import {
  getAllManifests,
  getSelectedManifest
} from '../../selectors/manifest_selector';

// Main component for viewing/editing manifests.
export class Manifests extends React.Component{
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(){
    /*
     * This function must run for any new manifest to process correctly. It
     * allows the manifest selector to properly set the current user on a new
     * manifest.
     */
    this.props.addTokenUser();
    this.props.requestManifests();
  }

  create() {
    // A manifest with an id of '0' is a new manifest.
    let date = new Date;
    let manifest = {
      id: 0,
      access: 'private',
      name: '',
      description: '',
      script: '',
      created_at: date.toString(),
      updated_at: date.toString()
    };
    this.setState({manifest});
  }

  setManifest({manifest}){
    this.selectManifest(manifest.id);
  }

  selectManifest(id){
    if(!id){
      this.setState({manifest: null, md5sum: null});
      return;
    }

    let manifest = this.props.manifests.find(m=>m.id ==id);

    // Copy the manifest so you don't modify the store.
    this.setState({
      manifest: { ...manifest },
      md5sum: manifest.md5sum
    });
  }

  updateField(field_name){
    return (event)=>{
      let {manifest, md5sum} = this.state;
      let new_md5sum;

      if(field_name == 'script'){
        // The code editor does not emit an event, just the new value.
        manifest.script = event;
        new_md5sum = md5(manifest.script);
      }
      else{
        manifest[field_name] = event.target.value;
      }
      this.setState({manifest, md5sum: new_md5sum || md5sum});
    }
  }

  saveManifest(){
    // A new manifest should have an id set to 0.
    if(this.state.manifest.id <= 0){
      this.props.saveNewManifest(
        this.state.manifest,
        this.setManifest.bind(this)
      );
    }
    else{
      this.props.saveManifest(this.state.manifest);
    }
  }

  copyManifest(){
    this.props.copyManifest(this.state.manifest, this.setManifest.bind(this));
  }

  deleteManifest(){
    this.props.deleteManifest(
      this.state.manifest,
      ()=>this.selectManifest(0)
    );
  }

  revertManifest(){
    let {manifest: {id}} = this.state;
    if(id > 0){
      this.selectManifest(id);
    }
    else{
      this.setState({manifest: null});
    }
  }

  render(){
    let {sections, is_admin} = this.props;
    let {manifest, md5sum} = this.state;

    let list_menu_props = {
      name: 'Manifest',
      create: this.create.bind(this),
      select: this.selectManifest.bind(this),
      sections: sections
    };

    let manifest_view_props = {
      force_edit: (manifest && manifest.id == 0),
      update: this.updateField.bind(this),
      revert: this.revertManifest.bind(this),
      save: this.saveManifest.bind(this),
      copy: this.copyManifest.bind(this),
      remove: this.deleteManifest.bind(this),
      md5sum,
      manifest,
      is_admin
    }

    return(
      <div className='manifest-group'>

        <div className='left-column-group'>

          <ListMenu {...list_menu_props} />
        </div>
        <div className='right-column-group'>

          <ManifestView {...manifest_view_props} />
        </div>
      </div>
    );
  }
}

const accessFilter = (access, manifests)=>{
  return manifests.filter(m => m.access == access).sort((a,b) => a > b);
};

const mapStateToProps = (state = {}, own_props)=>{
  let manifests = getAllManifests(state);
  let sections = {
    Public: accessFilter('public', manifests),
    Private: accessFilter('private', manifests),
    View: accessFilter('view', manifests)
  };

  // Loop the user permissions to check if the user is an admin.
  let is_admin = false;
  state.app.user.permissions.forEach((perm)=>{
    if(
      APP_CONFIG.project_name == perm.project_name &&
      perm.role == 'administrator'
    ) is_admin = true;
  });

  // Remove the manifests used for views if the user is not a admin.
  if(!is_admin) delete sections['View'];

  return {
    manifests,
    sections,
    is_admin
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    addTokenUser: ()=>{
      dispatch(addTokenUser());
    },

    requestManifests: ()=>{
      dispatch(requestManifests());
    },

    saveNewManifest: (manifest, success)=>{
      dispatch(saveNewManifest(manifest, success));
    },

    saveManifest: (manifest)=>{
      dispatch(saveManifest(manifest));
    },

    copyManifest: (manifest, success)=>{
      dispatch(copyManifest(manifest, success));
    },

    deleteManifest: (manifest, success)=>{
      dispatch(deleteManifest(manifest, success));
    }
  };
}

export const ManifestsContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(Manifests);
