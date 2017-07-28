/* 
 * Generates a psudo random key for React components and data element sorting.
 * DO NOT USE FOR SECURITY!
 */
export const generateRandKey = function(){
  var randKey = '';
  for(var a = 0; a < 4; ++a){
    randKey += (Math.random() * 0xFFFFFF << 0).toString(16);
  }
  return randKey;
};