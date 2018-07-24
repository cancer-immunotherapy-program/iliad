import React from 'react';
import VectorResult from './vector_result';
import MatrixResult from './matrix_result';
import Vector from '../../models/vector';
import Matrix from '../../models/matrix';

const isPrimitiveType = (value)=>{
  return(
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'undefined' ||
    typeof value === null
  );
};

const isVector = (value)=>{
  return (value instanceof Vector && isPrimitiveType(value(0)));
};

const isMatrix = (value)=>{
  return (value instanceof Matrix);
};

const ConsignmentResult = ({name, data, nestLevel})=>{
  if(isPrimitiveType(data)){
    return <div className='consignment-primitive-result'>{String(data)}</div>;
  }
  else if(isVector(data)){
    return <VectorResult vector={data} name={name} />;
  }
  else if(isMatrix(data)){
    return <MatrixResult matrix={data} name={name} />;
  }
  else{
    return null;
  }
};

export default ConsignmentResult;
