// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import ButtonBar from '../general/button_bar';
import Consignment from '../../models/consignment';

// Module imports.
import ManifestScript from './manifest_script';
import ConsignmentView from './consignment_view';

import {requestConsignments} from '../../actions/manifest_actions';
import {cloneManifest} from '../../selectors/manifest_selector';
import {selectConsignment} from '../../selectors/consignment_selector';

import {formatDate} from '../../utils/dates';

export class ManifestView extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      is_editing: false,
    };

    this.buttons = {
      copy: {
        click: ()=>{this.props.copy();},
        icon: 'far fa-file',
        label: 'COPY'
      },
      remove: {
        click: ()=>{
          if(confirm('Are you sure you want to remove this manifest?')){
            this.props.remove();
          }
        },
        icon: 'far fa-trash-alt',
        label: 'DELETE'
      },
      edit: {
        click: this.toggleEdit.bind(this),
        icon: 'fas fa-pencil-alt',
        label: 'EDIT'
      },
      run: {
        icon: 'fas fa-play',
        label: 'RUN',
        click: this.runManifest.bind(this)
      },
      save: {
        click: this.updateManifest.bind(this),
        icon: 'far fa-save',
        label: 'SAVE'
      },
      cancel: {
        click: this.cancelEdit.bind(this),
        icon: 'fas fa-ban',
        label: 'CANCEL'
      }
    };
  }

  runManifest(){
    let {consignment, requestConsignments, manifest} = this.props;
    if(!consignment) requestConsignments([manifest]);
  }

  updateManifest(){
    let {is_editing} = this.state;
    this.props.save();
    if(is_editing) this.toggleEdit();
  }

  cancelEdit(){
    // Reset the manifest.
    this.props.revert();

    // Turn of the editing mode.
    this.toggleEdit();
  }

  toggleEdit(){
    this.setState({
      is_editing: (!this.state.is_editing)
    });
  }

  editState() {
    let { is_editing } = this.state;
    let { force_edit } = this.props;

    return force_edit || is_editing;
  }

  getButtons() {
    let is_editing = this.editState();
    let {consignment} = this.props;
    let {run, save, cancel, plot, copy, remove, edit} = this.buttons;
    return [
      !consignment && run,
      is_editing && save,
      is_editing && cancel,
      !is_editing && copy,
      !is_editing && remove,
      !is_editing && edit
    ].filter(button=>button);
  }

  render(){
    let {consignment, manifest, update, is_admin} = this.props;
    if (manifest == null) return null;

    let {script, name, user, updated_at, description, access} = manifest;
    let is_editing = this.editState();
    let disabled = (!is_editing) ? 'disabled' : '';

    let buttons = this.getButtons();

    let input_props = {
      className: `${disabled} manifest-form-title-input`,
      onChange: update('name'),
      value: name,
      placeholder: 'No name',
      type: 'text',
      disabled
    };

    let textarea_props = {
      className: `${disabled} manifest-form-description`,
      onChange: update('description'),
      value: (description) ? description : '',
      placeholder: 'No description',
      disabled
    };

    let priv_props = {
      name: 'manifest-access',
      onChange: update('access'),
      type: 'radio',
      value: 'private',
      checked: (manifest.access == 'private') ? 'checked' : '',
      disabled
    };

    let pub_props = {
      name: 'manifest-access',
      onChange: update('access'),
      type: 'radio',
      value: 'public',
      checked: (manifest.access == 'public') ? 'checked' : '',
      disabled
    };

    let view_props = {
      name: 'manifest-access',
      onChange: update('access'),
      type: 'radio',
      value: 'view',
      checked: (manifest.access == 'view') ? 'checked' : '',
      disabled
    };
    let view_radio = (
      <div style={{display: 'inline-block'}}>

        <input {...view_props} />{'VIEW'};
      </div>
    );
    if(!is_admin) view_radio = null;

    let manifest_id = (
      <div className='manifest-form-detail'>

        <span>{'MANIFEST ID:'}&nbsp;&nbsp;</span>
        {`(${manifest.id})`}
      </div>
    );
    if(!is_admin) manifest_id = null;

    return(
      <div className='manifest-elements'>

        <div className='manifest-form-group'>

          <div className='manifest-form-header'>

            <div className='manifest-form-title'>

              <input {...input_props} />
              <ButtonBar className='manifest-action-btn-group' buttons={buttons} />
              <span style={{float: 'right'}}>

                {is_editing && 'EDITING'}
              </span>
            </div>
            <div className='manifest-form-details'>

              <div className='manifest-form-detail'>

                <span>{'AUTHOR:'}&nbsp;&nbsp;</span>
                {user}
              </div>
              <div className='manifest-form-detail'>

                <span>{'LAST UPDATED:'}&nbsp;&nbsp;</span>
                {updated_at}
              </div>
              <div className='manifest-form-detail'>

                <span>{'ACCESS:'}&nbsp;&nbsp;</span>
                <input {...priv_props} />{'PRIVATE'}
                &nbsp;
                <input {...pub_props} />{'PUBLIC'}
                &nbsp;
                {view_radio}
              </div>
              {manifest_id}
              <br />
              <div className='manifest-form-detail'>

                <span>{'DESCRIPTION: '}</span>
              </div>
              <br />
              <textarea {...textarea_props} />
            </div>

          </div>
          <ManifestScript script={script} is_editing={is_editing} onChange={update('script')} />
          <ConsignmentView consignment={consignment}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  return {
    consignment: own_props.md5sum && selectConsignment(state, own_props.md5sum)
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    requestConsignments: (manifests)=>{
      dispatch(requestConsignments(manifests));
    }
  };
}

export const ManifestViewContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(ManifestView);
