import Vector from '../models/vector';
import Matrix from '../models/matrix';

export const isPrimitiveType = (value)=>(
  typeof value === 'string' ||
  typeof value === 'number' ||
  typeof value === 'boolean' ||
  typeof value === 'undefined' ||
  value === null
);

export const isVector = (value) => (value instanceof Vector);

export const isMatrix = (value) => (value instanceof Matrix);
