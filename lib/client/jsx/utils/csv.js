import json2csv from 'json2csv'
import downloadjs from 'downloadjs'

export const downloadCSV = (data, fields, fileName)=>{
  try {
    let result = json2csv.parse(data, {fields: fields, del: ','});
    downloadjs(result, fileName+'.csv', 'text/csv');
  }
  catch(err){
    /*
     * Errors are thrown for bad options, or if the data is empty and no fields
     * are provided. Be sure to provide fields if it is possible that your data * array will be empty.
     */
    console.error(err);
  }
}
