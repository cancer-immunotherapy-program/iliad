// Framework libraries.
import * as React from 'react';

import SlowTextInput from '../inputs/slow_text_input';

// This is an input to create and edit a list of items.
export default class ListInput extends React.Component{
  constructor(){
    super();
    this.state = {
      edit_new_value: false,
      edit_link: false
    };
  }

  listItem(list_item, pos){
    let className = 'delete_link';

    if(list_item == null || list_item == ''){
      list_item = 'null';
      className = 'delete_link empty';
    }

    return(
      <div key={pos} className='list_item'>

        <span className={className} onClick={()=>this.removeValue(pos)}>

          {list_item}
        </span>
      </div>
    );
  }

  removeValue(pos){
    let {values, onChange} = this.props;
    let new_values = values.slice(0, pos).concat(values.slice(pos+1));
    onChange(new_values);
  }

  addValue(){
    let {values, onChange} = this.props;
    let new_values = values.concat('');
    onChange(new_values);
  }

  editValue(new_value){
    if(new_value == null || new_value == undefined || new_value == '') return;

    let {values, onChange} = this.props;
    let new_values = values.slice();
    new_values.splice(values.length-1, 1, new_value);
    onChange(new_values);
  }

  addListItem(){
    // Add a new value to the list.
    this.addValue();

    // Turn on editing.
    this.setState({edit_new_value: true});
  }

  renderEdit(value, input_props){
    let blur = ()=>this.setState({edit_new_value: false});
    input_props = Object.assign(
      input_props,
      {
        onChange: this.editValue.bind(this),
        onBlur: blur,
        default_value: value
      }
    );
    return(
      <div className='list_item'>

        <SlowTextInput {...input_props} />
      </div>
    );
  }

  renderAdd(){
    return(
      <div className='list_item'>
        <span className='add_item' onClick={this.addListItem.bind(this)}>

          {'+'}
        </span>
      </div>
    );
  }

  render(){
    let {values, ...input_props} = this.props;
    let {edit_new_value} = this.state;
    let new_value;

    if(edit_new_value){
      new_value = values.slice(-1);
      values = values.slice(0, -1);
    }

    return(
      <div className='list_input'>

        {values.map(this.listItem.bind(this))}
        {edit_new_value ? this.renderEdit(new_value, input_props) : null}
        {this.renderAdd()}
      </div>
    );
  }
}
