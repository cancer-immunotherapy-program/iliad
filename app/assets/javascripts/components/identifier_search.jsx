import * as React from 'react';
import * as ReactRedux from 'react-redux';

import {requestIdentifiers} from '../actions/magma_actions';

class IdentifierSearch extends React.Component{
  constructor(props){
    super(props);
    this['state'] = {
      'open': false,
      'inputValue': ''
    };
  }

  componentWillMount(){
    this.props.requestIdentifiers(this['props']['project_name']);
  }

  findMatches(){
    var self = this;

    var match_exp = new RegExp(this['state']['inputValue'], 'i');
    var matches = null;

    Object.keys(this['props']['identifiers']).forEach(function(model_name){

      var identifiers = self['props']['identifiers'][model_name];
      identifiers.forEach(function(name){

        if(name.match(match_exp)){
          matches = matches || {};
          matches[model_name] = (matches[model_name] || []).concat(name);
        }
      });
    });

    return matches;
  }

  renderIdentifiers(matches, modelName){
    var self = this;
    return matches.map(function(identifier){

      var linkProps = {
        'className': 'identifier-search-group-item',
        'key': identifier,
        'href': Routes.browse_model_path(
          self.props.project_name,
          modelName,
          encodeURIComponent(identifier)
        )
      };

      return(
        <a {...linkProps}>

          {identifier}
        </a>
      );
    });
  }

  renderMatches(matchingIdents){
    var self = this;
    return Object.keys(matchingIdents).map(function(modelName){

      var matches = matchingIdents[modelName];
      return(
        <div className='identifier-search-group' key={modelName}>

          <div className='identifier-search-group-header'>

            {modelName.charAt(0).toUpperCase()+modelName.slice(1)}
           </div>
          {self.renderIdentifiers(matches, modelName)}
        </div>
      );
    });
  }

  renderDropdown(){
    if(!this['state']['open']) return null;
    if(this['state']['inputValue']['length'] < 3) return null;

    var matchingIdents = this.findMatches();
    if(!matchingIdents) return null;

    var dropdownProps = {
      'id': 'identifier-drop-down',
      'ref': (component)=>{this['dropdownTrayComponent'] = component}
    };

    return(
      <div {...dropdownProps}>

        {this.renderMatches(matchingIdents)}
      </div>
    );
  }

  render(){

    // Don't render until we have data to search on.
    if(this['props']['identifiers'] == null) return null;

    var self = this;
    var identSearchProps = {
      'id': 'identifier-serach-group',
      'onBlur': function(evt){

        /*
         * 'currentTarget' prevents the state set if the element is a child of
         * of the <IdentifierSearch /> component. i.e. this prevents the 
         * dropdown tray from closing when a child component is clicked.
         */
        var currentTarget = evt.currentTarget;
        setTimeout(function(){
          if(!currentTarget.contains(document.activeElement)){
            self.setState({'open': false});
          }
        },200);
      },
      'onClick': function(evt){
        self.setState({'open': true});
      }
    };

    var inputProps = {
      'id': 'identifier-search-input',
      'type': 'text',
      'maxLength': 26,
      'onChange': function(evt){
        self.setState({'inputValue': evt['target']['value']});
      }
    };

    return(
      <div {...identSearchProps}>

        <input {...inputProps} />
        <button id='identifier-search-button'>

          <i className='fa fa-search' aria-hidden='true'></i>
        </button>
        {this.renderDropdown()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps)=>{
  var idents = {};
  var models = state['magma']['models'];

  Object.keys(models).forEach(function(model_name){
    idents[model_name] = Object.keys(models[model_name]['documents']);
  });

  return {
    'identifiers': Object.keys(idents)['length'] ? idents : null
  };
};

const mapDispatchToProps = (dispatch, ownProps)=>{
  return {
    requestIdentifiers: function(project_name){
      dispatch(requestIdentifiers(project_name));
    }
  };
};

export default ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(IdentifierSearch);

