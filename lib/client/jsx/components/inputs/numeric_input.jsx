// Framework libraries.
import * as React from 'react';
import SlowTextInput from '../inputs/slow_text_input';
import {
  intFilter,
  floatFilter
} from '../../utils/keycode';

/*
 * This is an input to edit numbers - it applies some filters to prevent
 * non-numerical characters. It has a prop 'inputType' with values float, int to
 * filter for either floats or ints.
 */

const floatTransform = (value) => parseFloat(value);
const intTransform = (value) => parseInt(value.replace(/_/, ''));

const numericInput = (filter, transform)=>{
  return (WrappedInput)=>{
    return ({onChange, ...other_props})=>{

      other_props = Object.assign(
        other_props,
        {
          onKeyPress: filter,
          onChange: (value)=>onChange(transform(value))
        }
      );

      return <WrappedInput {...other_props} />;
    }
  }
}

export const withIntegerFilter = numericInput(intFilter, intTransform);
export const IntegerInput = withIntegerFilter(SlowTextInput);
export const FloatInput = numericInput(floatFilter, floatTransform)(SlowTextInput);
