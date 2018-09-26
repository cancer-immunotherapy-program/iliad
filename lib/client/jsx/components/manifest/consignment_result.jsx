import React from 'react';
import VectorResult from './vector_result';
import MatrixResult from './matrix_result';
import Vector from '../../models/vector';
import Matrix from '../../models/matrix';

import {
  isPrimitiveType,
  isVector,
  isMatrix
} from '../../utils/types'

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
