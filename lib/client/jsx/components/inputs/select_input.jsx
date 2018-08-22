import * as React from 'react';

const NoneOption = (showNone)=>{
  if(showNone){
    return(
      <option disabled={showNone == 'disabled'} key='none' value=''>

        {' --- '}
      </option>
    );
  }
  else{
    return null;
  }
};

const Option = (val, index)=>{
  if(val != null && Object.keys(val).includes('value', 'text')){
    return <option key={index} value={index}>{val.text}</option>;
  }
  else{
    return <option key={index} value={index}>{val}</option>;
  }
};

// This is an input to select one from a list of options.
export default class SelectInput extends React.Component{
  onChange(evt){
    let index = evt.target.value;
    let {onChange, values} = this.props;
    let value = values[parseInt(index)];

    // props.values may be [ { key, value, text } ]
    if(
      value != null &&
      typeof value === 'object' &&
      'value' in value
    ) value = value.value;

    if(onChange) onChange(value == '' ? null : value);
  }

  render(){
    let {children, values, showNone, defaultValue} = this.props;
    defaultValue = defaultValue || (showNone ? '' : null);

    let select_props = {
      className: 'general-select',
      defaultValue: defaultValue,
      onChange: this.onChange.bind(this)
    };

    return(
      <select {...select_props}>

        {children }
        {NoneOption(showNone)}
        {values.map(Option)}
      </select>
    );
  }
}
