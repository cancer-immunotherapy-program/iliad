// Framework libraries.
import * as React from 'react';

import debounce from '../../utils/debounce';

// This is an input that debounces text input of some sort.
export default class TextAreaInput extends React.Component{
  constructor(){
    super();
    this.state = {};
  }

  onChange(value){
    this.props.onChange(value);
  }

  handleChange(){
    let input_value = this.text_input.value;
    this.setState({input_value});
    this.onChange(input_value);
  }

  componentWillMount(){
    this.onChange = debounce(this.onChange, this.props.waitTime || 500);
  }

  render(){
    let {onChange, wait_time, default_value, ...input_props} = this.props;
    let {input_value} = this.state;

    input_props = Object.assets(
      input_props,
      {
        ref: (input)=>(this.text_input = input),
        onChange: this.handleChange.bind(this),
        value: (input_value == undefined) ? default_value : input_value
      }
    );

    return <textarea {...input_props} />;
  }
}
