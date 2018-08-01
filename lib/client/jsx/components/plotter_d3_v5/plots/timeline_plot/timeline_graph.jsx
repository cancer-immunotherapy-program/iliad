import React, {Component} from 'react';
import * as d3 from 'd3';
import Axis from '../../axis';
import TimelineEvents from './timeline_events';
import Tooltip from './tooltip';

class TimelineGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeDomain:[],
      data: [],
      tooltip: {display: false, data: {key: '',value: ''}},
      zoom_transform: null
    };

    this.timeScale = d3.scaleTime();
    this.bandScale = d3.scaleBand();
    this.showToolTip = this.showToolTip.bind(this);
    this.hideToolTip = this.hideToolTip.bind(this);
    this.zoom = d3.zoom();
  }

  static getDerivedStateFromProps(next_props, prev_state){
    if(next_props.all_events.length <= 0 ) return null;
    
    // Set start and end date for timeline axis.
    let min =  next_props.all_events[0].start ? 
      new Date(next_props.all_events[0].start) : null;

    let max =  next_props.all_events[0].end ? 
      new Date(next_props.all_events[0].end) : min;

    for(let i = 1; i < next_props.all_events.length; i++) {
      let start_time = next_props.all_events[i].start ? 
        new Date (next_props.all_events[i].start) : null;

      let end_time = next_props.all_events[i].end ? 
        new Date(next_props.all_events[i].end) : start_time;

      if(start_time < min){min = start_time;} 
      if(end_time > max){max = end_time;}
    }

    let current_date = new Date();
    if(max > current_date){
      max = current_date;
    }

    return {
      timeDomain: [min, max],
      data: next_props.all_events
    };
  }

  componentDidMount() {
    d3.select(this.refs.svg)
      .call(this.zoom);
  }
  componentDidUpdate() {
    d3.select(this.refs.svg)
      .call(this.zoom);
  }
  zoomed() {
    this.setState({ 
      zoom_transform: d3.event.transform
    });
  }

  showToolTip(event) {
    let {target} = event;

    let rec_x = parseFloat(target.getAttribute('width')) / 2 + 
      parseFloat(target.getAttribute('x'));

    let rec_y = parseFloat(target.getAttribute('y')) + 
      parseFloat(target.getAttribute('height')) / 2;

    let cir_x = parseFloat(target.getAttribute('cx'));
    let cir_y = parseFloat(target.getAttribute('cy'));

    this.setState({
      tooltip:{
        display:true,
        data: {
          'patient-id':target.getAttribute('data-patient-id'),
          type: target.getAttribute('data-type'),
          start: target.getAttribute('data-start'),
          end: target.getAttribute('data-end'),
          value: target.getAttribute('data-value') || null
        },
        location:{ 
          x: target.getAttribute('x') ? rec_x : cir_x,
          y: target.getAttribute('y') ? rec_y : cir_y
        } 
      }
    });
  }

  hideToolTip() {
    this.setState({
      tooltip:{ 
        display:false,
        data:{
          type:'',value:''
        }
      }
    });
  }

  render() {
    if(this.state.timeDomain.length < 1) return null;
    let {timeDomain, data, tooltip, zoom_transform} = this.state;
    let margins = {top: 41, right: 5, bottom: 100, left: 150};
    let svg_dimensions = { 
      width: Math.max(this.props.parent_width, 500),
      height: data.length * 24 + 481
    };
    
    //Create time scale.
    let xScale = this.timeScale
      .domain(timeDomain)
      .range([margins.left, svg_dimensions.width - margins.right])
      .nice();
    
    let yScale = this.bandScale
      .padding(0.5)
      .domain(data.map(datum => datum.event_id))
      .range([svg_dimensions.height - margins.bottom, margins.top]);

    this.zoom.scaleExtent([1, 100])
      .translateExtent([
        [0, 0], 
        [svg_dimensions.width, svg_dimensions.height]
      ])
      .extent([
        [0, 0], 
        [svg_dimensions.width, svg_dimensions.height]
      ])
      .on("zoom", this.zoomed.bind(this));

    let xProps = {
      orient: 'Bottom',
      scale: xScale,
      translate: `translate(0, ${svg_dimensions.height - margins.bottom})`,
      tickSize: svg_dimensions.height - margins.top - margins.bottom,
      timeformat: "%b '%y"
    };
    
    let yProps = {
      orient: 'Left',
      scale: yScale,
      translate: `translate(${margins.left}, 0)`,
      tickSize: svg_dimensions.width - margins.left - margins.right
    };

    let events_props = {
      scales: {xScale, yScale},
      margins,
      data,
      svg_dimensions,
      showToolTip: this.showToolTip,
      hideToolTip: this.hideToolTip,
      color: this.props.color,
      zoom_transform,
      x: 0,
      y: 0
    };

    let tooltip_props = {
      tooltip: tooltip, 
      text_style: 'tooltip-text',
      bg_style: 'tooltip-bg',
      x_value1: 'Patient ID',
      x_value2: 'Type', 
      y_value: 'Value'
    };

    let rect_props = {
      className: 'zoom',
      width: svg_dimensions.width - margins.right - margins.left,
      height: svg_dimensions.height,
      transform: `translate(${margins.left}, ${margins.top})`,
    }

    return(
      <svg {...svg_dimensions} ref='svg' >
        <Axis {...xProps} />
        <Axis {...yProps} />
        <clipPath id='clip'>
          <rect {...rect_props}  />
        </clipPath>
        <TimelineEvents {...events_props} />
        <Tooltip {...tooltip_props}/>
      </svg>
    );
  }
}

export default TimelineGraph;