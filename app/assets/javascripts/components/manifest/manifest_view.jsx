import * as React from 'react';
import * as ReactRedux from 'react-redux';
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

  render() {
    const { manifest, consignment, deleteManifest, toggleEdit, copyManifest, requestConsignments } = this.props
    const { is_editable, name } = manifest

    const elements =  manifest.data.elements || []

    const manifestElements = elements.map((element, i) => {
      let elementResult
      if (consignment) {
        if (consignment[element.name]) {
          elementResult = consignment[element.name]
        } else if (consignment && !consignment[element.name]) {
          elementResult = ''
        } 
      } else {
        elementResult = ''
      }
      const props = { ...element, result: elementResult, view_mode: this.state.view_mode }
      return (
        <li key={i}>
          <ManifestElement {...props}/>
        </li>
      )
    })

    return (
      <div className='manifest'>
        <div className='manifest-elements'>
          <div className='actions'>
            { is_editable &&
              <button onClick={toggleEdit}>
                <i className='fa fa-pencil-square-o' aria-hidden="true"></i>
                edit
              </button>
            }
            <button onClick={() => copyManifest(manifest)}>
              <i className='fa fa-files-o' aria-hidden="true"></i>
              copy
            </button>
            { is_editable &&
                <button onClick={ () => deleteManifest(manifest.id)}>
              <i className='fa fa-trash-o' aria-hidden="true"></i>
              delete
            </button>
            }
          </div>
          <ManifestPreview {...manifest} />
          <ToggleSwitch 
            id="view_mode_switch"
            caption="Show"
            onChange={ (view_mode) => {
              this.setState({ view_mode })
              if (view_mode == 'output' && !consignment) {
                if (!consignment) requestConsignments([manifestToReqPayload(manifest)])
              }
            } }
            selected={this.state.view_mode}
            values={[ 'script', 'output' ]}
          />
          <ol>
            {manifestElements}
          </ol>
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

export default ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(ManifestView);
