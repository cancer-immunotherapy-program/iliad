// Framework libraries.
import * as React from 'react';
import { Chart } from 'react-google-charts';

export default class TimelineWidget extends React.Component{
  constructor(props){
    super(props);

    this.state = {};
  }

  componentWillMount() {
    // load data
  }

  componentDidUpdate() {
    // render example D3
}
  AEInfoTip(treatment, start_date, end_date, ae_term, ae_grade) {
  return '<div style="padding:5px 5px 5px 5px;">' + '<br/>' +
      '<table class="ae_in">' + '<tr>' +
      '<td>Treatment: </td>' +
      '<td><b>' + treatment + '</b></td>' + '</tr>' + '<tr>' +
      '<td>Start Date: </td>' +
      '<td><b>' + start_date + '</b></td>' + '</tr>' + '<tr>' +
      '<td>End Date: </td>' +
      '<td><b>' + end_date + '</b></td>' + '</tr>' + '<tr>' +
      '<td>Duration: </td>' +
      '<td><b>' + 'xx xx xx' + '</b></td>' + '</tr>' + '<tr>' +
      '<td>Adverse Event: </td>' +
      '<td><b>' + ae_term + '</b></td>' + '</tr>' + '<tr>' +
      '<td>Grade: </td>' +
      '<td><b>' + ae_grade + '</b></td>' + '</tr>' + '</table>' + '</div>';
}
  render(){

    let timeline_props = {
      chartType:"Timeline",
      columns:[
        {"id":"Patient","type":"string"},
        {"id":"Treatment","type":"string"},
        {'type': 'string', 'role': 'tooltip', 'p': {'html': true}},
        {"id":"Start","type":"date"},
        {"id":"End","type":"date"},
      ],
      rows:[
        [ 'Patient 1001', 'Teatment A', this.AEInfoTip( 'Test Treatment A',new Date(1999, 3, 12).toDateString(), new Date(2007, 2, 4).toDateString(), 'test-term', '2: test-grade'), new Date(1999, 3, 30), new Date(2007, 2, 4)],
        [ 'Patient 1001', 'Teatment C', this.AEInfoTip( 'Test Treatment C',new Date(2001, 8, 4).toDateString(), new Date(2009, 3, 8).toDateString(), 'test-term', '2: test-grade'), new Date(2001, 8, 4), new Date(2009, 3, 8)],
        [ 'Patient 1002', 'Teatment B', null, new Date(1997, 7, 4), new Date(1999, 8, 9)],
        [ 'Patient 1002', 'Teatment C', null, new Date(1998, 12, 4), new Date(1999, 8, 9)],
        [ 'Patient 1003', 'Teatment D', null, new Date(2001, 8, 4), new Date(2009, 3, 8)],
        [ 'Patient 1002', 'Teatment D', null, new Date(2006, 8, 4), new Date(2009, 3, 8)],
        [ 'Patient 1003', 'Teatment G', null, new Date(2011, 8, 4), new Date(2017, 3, 8)],
        [ 'Patient 1001', 'Teatment A', null, new Date(2008, 8, 4), new Date()],

      ],
      options:{
        "width":"600px", 
        tooltip: {isHtml: true},
      },
      width:"100%",
      chartPackage:"timeline"
    }
    return(
      <div className={'google-chart-container'}>
        <Chart {...timeline_props}/>
      </div>
    );
  }
}