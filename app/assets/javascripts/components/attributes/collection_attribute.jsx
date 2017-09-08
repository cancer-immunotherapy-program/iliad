import React from 'react';
import * as ReactRedux from 'react-redux';
import { reviseDocument } from '../../actions/magma_actions'
import MagmaLink from '../magma_link';

var CollectionList = React.createClass({
  getInitialState: function() {
    return { new_link_updated: false }
  },
  update: function(new_links) {
    this.props.reviseList( new_links )
  },
  componentWillMount: function() {
    this.update = this.debounce(200,this.update);
  },

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

  debounce: function(func, wait, immediate){
    var timeout;
    return function(){
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if(!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    }
  },

  render: function() {
    var self = this
    var links = this.props.value || []
    if (this.props.mode == "edit") {
      var stable_links = (this.props.revision || []).slice()
      var edit_link = this.state.new_link_value ? stable_links.pop() : null
      return <div className="value">
               <div className="collection">
                {
                  stable_links.map(
                    function(link,i) {
                      return <div key={ i } className="collection_item">
                      <span className="delete_link"
                        onClick={
                          function(e) {
                            self.props.reviseList(
                              stable_links
                                .slice(0,i)
                                .concat(stable_links.slice(i+1))
                                .concat(edit_link ? edit_link : [] )
                            )
                          }
                        }
                      >{ link }</span>
                      </div>
                    })
                }
                {
                  this.state.show_new_link ?
                  <div className="collection_item">
                    <input
                      type='text'
                      className="link_text" 
                      placeholder="New or existing ID"
                      onChange={
                          function(e) {
                            var value = e.target.value
                            var has_value = value && value.length
                            self.setState({ new_link_value: value })

                            // catch the first debounce for greater clarity
                            var new_links = stable_links.concat(has_value ? value : [])

                            if (value && !edit_link)
                              self.props.reviseList( new_links )
                            else
                              self.update( new_links )
                          }
                      }
                      value={ this.state.new_link_value }
                      onBlur={
                        function(e) {
                          self.setState({ show_new_link: null, new_link_value: null })
                        }
                      }
                      />
                  </div>
                  :
                    null
                }
                <div className="collection_item">
                  <span className="add_item"
                    onClick={
                      function(e) {
                        self.setState({ show_new_link: true })
                      }
                    }>+</span>
                </div>
               </div>
             </div>
    }
    return <div className="value">
             <div className="collection">
              {
                links.map(
                  function(link) {
                    return <div key={ link } className="collection_item">
                      <MagmaLink link={ link } model={ self.props.attribute.model_name }/>
                    </div>
                  })
               }
             </div>
           </div>
  }
})

var CollectionAttribute = ReactRedux.connect(
  function(state, ownProps) {
    return ownProps
  },
  function(dispatch,ownProps) {
    return {
      reviseList: function(newlist) {
        dispatch(
          reviseDocument(
            ownProps.document,
            ownProps.template,
            ownProps.attribute,
            newlist)
        )
      }
    }
  }
)(CollectionList);

CollectionAttribute.contextTypes = {
  store: React.PropTypes.object
}

module.exports = CollectionAttribute
