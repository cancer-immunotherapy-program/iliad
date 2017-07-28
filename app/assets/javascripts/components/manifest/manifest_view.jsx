import * as React from 'react';
import ToggleSwitch from '../toggle_switch';
import Dates from '../../dates';
import {requestConsignments} from '../../actions/consignment_actions';
import {selectConsignment} from '../../selectors/consignment';
import {manifestToReqPayload, deleteManifest, toggleEdit, copyManifest} from '../../actions/manifest_actions';

/*
 * Shows a single manifest - It has two states, 'script' (which shows the 
 * manifest script) and 'output' (which shows the resulting data). Sends a
 * request for a consignment when 'output' is clicked if none exists.
 */

class ManifestView extends React.Component{
  constructor(){
    super();
    this['state'] = {'viewMode': 'script'};
  }

  renderManifestControls(){

    var props = this['props'];
    var deleteBtnProps = {
      'className': 'manifest-view-control-btn',
      'style': (props['manifest']['is_editable']) ? {} : {'display': 'none'},
      'onClick': ()=>{
        if(!confirm('Are you sure you want to delete this manifest?')) return;
        props.deleteManifest(props['manifest']['id']);
      }
    };

    var editBtnProps = {
      'className': 'manifest-view-control-btn',
      'style': (props['manifest']['is_editable']) ? {} : {'display': 'none'},
      'onClick': ()=>{
        props.toggleEdit();
      }
    };

    var queryBtnProps = {
      'className': 'manifest-form-control-btn'
    };

    var copyBtnProps = {
      'className': 'manifest-view-control-btn',
      'onClick': ()=>{
        if(props['isEditing']) props.toggleEdit();
        props.copyManifest(props['projectName'], props['manifest']);
      }
    };

    if(props['is_editable']){
      deleteBtnProps['style'] = editBtnProps['style'] = {'display': 'none'};
    }

    return(
      <div className='manifest-view-controls'>
        <button {...deleteBtnProps}>

          <i className='fa fa-trash-o' aria-hidden='true'></i>
          {' DELETE'}
        </button>
        <button {...editBtnProps}>

          <i className='fa fa-pencil-square-o' aria-hidden='true'></i>
          {' EDIT'}
        </button>
        <button {...copyBtnProps}>

          <i className='fa fa-files-o' aria-hidden='true'></i>
          {' COPY'}
        </button>
        <button {...queryBtnProps}>

          <i className='fa fa-play' aria-hidden='true'></i>
          {' RUN QUERY'}
        </button>
      </div>
    );
  }

  renderManifestElements(){
    var elements = this['props']['manifest']['data']['elements'] || [];
    return elements.map((element, index)=>{

      return(
        <div className='manifest-view-element' key={'element-'+index}>

          <div className='manifest-view-element-title'>

            {'@'+element['name']}
          </div>
          <span>

            {' = '}
          </span>
          <div className='manifest-view-element-body'>

            <pre className='manifest-view-code'>

              {element['script']}
            </pre>
          </div>
        </div>
      );
    });
  }

  render(){

    var manifest = this['props']['manifest'];
    var updateDate = Dates.format_date(Date.now());
    var updateTime = Dates.format_time(Date.now());
    if(manifest){
      updateDate = Dates.format_date(manifest['updated_at']);
      updateTime = Dates.format_time(manifest['updated_at']);
    }

    return(
      <div id='manifest-view-group'>

        <div id='manifest-view-header'>

          <div id='manifest-view-title'>

            {manifest['name']}
          </div>
          {this.renderManifestControls()}
        </div>
        <br />
        <div id='manifest-view-details'>

          {'Author: '+manifest['user']['name']}
          <br />
          {'Last Updated: '+updateDate+', '+updateTime}
          <br />
          {'Access: '+manifest['access']}
          <br />
          {'Description: '}
          <div id='manifest-view-description'>

            {(manifest['description']) ? manifest['description'] : 'N/A'}
          </div>
        </div>
        {this.render}
        <div id='manifest-view-body'>

          {this.renderManifestElements()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps)=>{
  var consignment = selectConsignment(state, ownProps['manifest']['name']);
  return {
     'consignment': consignment
  };
};

const mapDispatchToProps = (dispatch, ownProps)=>{
  return {
    'deleteManifest': function(manifestId){
      dispatch(deleteManifest(manifestId));
    },

    'copyManifest': function(projectName, manifest){
      dispatch(copyManifest(projectName, manifest));
    },

    'toggleEdit': function(){
      dispatch(toggleEdit());
    },

    'requestConsignments': function(){
      dispatch(requestConsignments());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManifestView);
