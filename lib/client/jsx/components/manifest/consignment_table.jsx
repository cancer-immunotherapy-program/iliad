// Framework libraries.
import * as React from 'react';

class ConsignmentTable extends React.Component{
  tableHeader(){
    let {headers} = this.props;

    return(
      <tr className='consignment-row'>
        {headers.map((col_name, index)=>{
          return <th className='consignment-header' key={index}>{col_name}</th>;
        })}
      </tr>
    );
  }

  tableRows(){
    let {headers, rows} = this.props;
    return rows.map((row, i)=>{

      return(
        <tr className='consignment-row' key={i}>

          {row.map((data, j)=>{
            return(
              <td className='consignment-cell' key={j}>{data}</td>
            );
          })}
        </tr>
      );
    });
  }

  render(){
    return(
      <div className='consignment-result-group'>

        <table className='consignment-table'>

          {this.tableHeader()}
          {this.tableRows()}
        </table>
      </div>
    );
  }
}

export default ConsignmentTable;
