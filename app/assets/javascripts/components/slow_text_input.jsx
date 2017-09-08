import React from 'react';
var SlowTextInput = React.createClass({
  // this is a simple wrapper that debounces text input of some sort
  getInitialState: function() {
    return { }
  },
  update: function() {
    this.props.update(this.text_input.value)
  },
  componentWillMount: function() {
    this.update = this.debounce(this.props.waitTime || 500,this.update);
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
    return <input type='text' 
      ref={ function(input) { self.text_input = input } }
      className={ this.props.textClassName }
      onChange={ 
        function(e) {
          self.setState({ input_value: e.target.value })
          self.update()
        }
      }
      onKeyPress={ this.props.onKeyPress }
      value={ this.state.input_value == undefined ? this.props.defaultValue : this.state.input_value }
      placeholder={ this.props.placeholder }/>
  }
})

module.exports = SlowTextInput
