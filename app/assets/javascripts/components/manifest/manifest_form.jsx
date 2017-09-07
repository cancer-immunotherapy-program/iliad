import React, { Component } from 'react'
import InputField from './input_field'
import TextField from './text_field'
import ManifestAccess from './manifest_access'
import ManifestElementForm from './manifest_element_form'
import Dates from '../../dates'
import { v4 } from 'node-uuid'
import { requestConsignments } from '../../actions/consignment_actions'
import { selectConsignment } from '../../selectors/consignment'
import { manifestToReqPayload, saveNewManifest, saveManifest, toggleEdit } from '../../actions/manifest_actions'

// Edit and save changes to a manifest.  Requests a consignment
// based on edited data when 'test' is clicked
class ManifestForm extends Component {
  componentWillMount() {
    if (this.props.manifest) {
      const elements = this.props.manifest.data.elements || []
      const elementsByKey = elements.reduce((acc, curr) => {
        const key = v4()
        return ({
          elementKeys: [...acc.elementKeys, key],
          elementsByKey: {...acc.elementsByKey, [key]: curr}
        })
      }, { elementKeys: [], elementsByKey: {} }) 
      this.setState(
        { 
          ...this.props.manifest,
          ...elementsByKey,
          hasConsignment: false
        }
      )
    } else {
      this.setState({
        name: '',
        access: 'private',
        elementKeys: [],
        elementsByKey: {},
        hasConsignment: false
      })
    }
  }

      var elements = this['props']['manifest']['data']['elements'] || [];
      var elementsByKey = elements.reduce((acc, curr)=>{
        var key = generateRandKey();
        return({
          'elementKeys': [...acc['elementKeys'], key],
          'elementsByKey': {...acc['elementsByKey'], [key]: curr}
        });
      }, {'elementKeys': [], 'elementsByKey': {}});

      this['state'] = {
        ...this['props']['manifest'],
        ...elementsByKey,
        'hasConsignment': false,
        'userName': this['props']['manifest']['user']['name']
      }
    }
    else{
      this['state'] = {
        'name': '',
        'access': 'private',
        'description': '',
        'project': this['props']['projectName'],
        'elementKeys': [],
        'elementsByKey': {},
        'hasConsignment': false,
        'userName': this['props']['currentUser']
      };
    }
  }

  stateToManifest() {
    var { elementKeys, elementsByKey } = this.state;
    var keys = elementKeys || [];
    var elements = keys.map(key => elementsByKey[key]);
    return {
      ...this.state,
      'data': { elements }
    };
  }

  create() {
    this.props.saveNewManifest(this.stateToManifest())
  }

  update() {
    this.props.saveManifest(this.stateToManifest())
  }

  removeElement(key){
    var removedKey = [...this['state']['elementKeys']].filter((elementKey)=>{
      if(elementKey !== key){
        return elementKey;
      }
    });

    var removedElement = {...this['state']['elementsByKey']};
    delete removedElement[key];

    this.setState({'elementKeys': removedKey, 'elementsByKey': removedElement});
  }

  addElement(){
    var key = generateRandKey();
    this.setState({
      'elementKeys': [...this['state']['elementKeys'], key],
      'elementsByKey': {
        ...this['state']['elementsByKey'],
        [key]: {'name': '', 'script': ''}
      }
    })
  }

  renderAccessSelect(){

    var radioPrivProps = {
      'type': 'radio',
      'name': 'manifest-access',
      'value': 'private',
      'onChange': (evt)=>{
        this.setState({'access': 'private'});
      }
    }

    var radioPubProps = {
      'type': 'radio',
      'name': 'manifest-access',
      'value': 'public',
      'onChange': (evt)=>{
        this.setState({'access': 'public'});
      }
    };

    if(this['state']['access'] == 'private'){
      radioPrivProps['checked'] = 'checked';
    }
    else{
      radioPubProps['checked'] = 'checked';
    }

    return(
      <div id='manifest-form-access-group'>

        <div className='manifest-form-group-title'>
  
          {'ACCESS: '}
        </div>
        <input {...radioPrivProps} />PRIVATE
        <br />
        <input {...radioPubProps} />PUBLIC
        <br />
      </div>
    );
  }

  renderManifestElements(){
    var self = this;
    return this['state']['elementKeys'].map((key)=>{
      var element = self['state']['elementsByKey'][key];

      var inputProps = {
        'type': 'text',
        'value': element['name'],
        'onChange': (evt)=>{
          self.updateElementAttribute(key, 'name', evt['target']['value']);
        }
      };

      var textareaProps = {
        'className': 'manifest-view-element-textarea',
        'value': element['script'],
        'onChange': (evt)=>{
          self.updateElementAttribute(key, 'script', evt['target']['value']);
        }
      };

      var removeBtnProps = {
        'className': 'manifest-form-control-btn',
        'onClick': (evt)=>{
          self.removeElement(key);
        }
      };

      return(
        <div className='manifest-form-element' key={'element-'+key}>

          <div className='manifest-form-element-title'>

            {'@'}
            <input {...inputProps} />
            <button {...removeBtnProps}>

              <i className='fa fa-times' aria-hidden='true'></i>
              {' REMOVE'}
            </button>
          </div>
          <span>

            {' = '}
          </span>
          <br />
          <textarea {...textareaProps}></textarea>
        </div>
      );
    });
  }

  renderManifestControls(){
    var self = this;
    var props = this['props'];
    var cancelBtnProps = {
      'className': 'manifest-form-control-btn',
      'onClick': this['props']['toggleEdit']
    };

    var saveBtnProps = {
      'className': 'manifest-form-control-btn',
      'onClick': (evt)=>{
        var manifest = self.stateToManifest();
        if(manifest['id']){
          self['props'].saveManifest(self['props']['projectName'], manifest); 
        }
        else{
          self['props'].saveNewManifest(self['props']['projectName'], manifest); 
        }
      }
    };

    var queryBtnProps = {
      'className': 'manifest-form-control-btn'
    };

    var addBtnProps = {
      'className': 'manifest-form-control-btn',
      'onClick': this.addElement.bind(this)
    };

    if(this['props']['is_editable']){
      deleteBtnProps['style'] = editBtnProps['style'] = {'display': 'none'};
    }

    return(
      <div className='manifest-form-controls'>
        <button {...addBtnProps}>

          <i className="fa fa-plus" aria-hidden='true'></i>
          {' ADD ITEM'}
        </button>
        <button {...cancelBtnProps}>

          <i className='fa fa-pencil-square-o' aria-hidden='true'></i>
          {' CANCEL'}
        </button>
        <button {...saveBtnProps}>

          <i className='fa fa-floppy-o' aria-hidden='true'></i>
          {' SAVE'}
        </button>
        <button {...queryBtnProps}>

          <i className='fa fa-play' aria-hidden='true'></i>
          {' RUN QUERY'}
        </button>
      </div>
    );
  }

  render(){

    var manifest = this['props']['manifest'];
    var updateDate = Dates.format_date(Date.now());
    var updateTime = Dates.format_time(Date.now());
    if(manifest){
      updateDate = Dates.format_date(manifest['updated_at']);
      updateTime = Dates.format_time(manifest['updated_at']);
    }

    var inputProps = {
      'type': 'text',
      'value': this['state']['name'],
      'onChange': (evt)=>{
        this.setState({'name': evt['target']['value']});
      }
    };

    var textareaProps = {
      'id': 'manifest-form-description',
      'value': this['state']['description'],
      'onChange': (evt)=>{
        this.setState({'description': evt['target']['value']});
      }
    };

    return(
      <div id='manifest-form-group'>

        <div id='manifest-form-header'>

          <div id='manifest-form-title'>

            {'NAME: '}
            <input {...inputProps} />
          </div>
          {this.renderManifestControls()}
        </div>
        <div id='manifest-form-details'>

          {'Author: '+this['state']['userName']}
          <br />
          {'Last Updated: '+updateDate+', '+updateTime}
          <br />
          {this.renderAccessSelect()}
          <br />
          <div className='manifest-form-group-title'>

            {'DESCRIPTION: '}
          </div>
          <br />
          <textarea {...textareaProps} />
        </div>
        <div id='manifest-form-body'>

          {this.renderManifestElements()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps)=>{
  return {
    'consignment': selectConsignment(state, 'editing-manifest')
  };
};

const mapDispatchToProps = (dispatch, ownProps)=>{
  return {
    'saveNewManifest': function(projectName, manifest){
      dispatch(saveNewManifest(projectName, manifest));
    },

    'saveManifest': function(projectName, manifest){
      dispatch(saveManifest(projectName, manifest));
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
)(ManifestForm);
