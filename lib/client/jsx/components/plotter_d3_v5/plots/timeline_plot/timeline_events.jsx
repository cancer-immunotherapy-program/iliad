import React, {Component} from 'react';

class TimelineEvents extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {scales, data, color, showToolTip, hideToolTip} = this.props;
    let {xScale, yScale} = scales;

    const events = data.map((datum, index) => {
      if(
        (datum.end !== undefined && datum.end !== null) && 
        datum.start !== datum.end
      ) {
        let rect_props = {
          key: `${datum.event_id}_${index}`,
          x: xScale(new Date(datum.start)),
          y: yScale(datum.event_id),
          height: yScale.bandwidth(),
          width: xScale(new Date(datum.end)) - xScale(new Date(datum.start)),
          fill: color,
          onMouseOver: showToolTip,
          onMouseOut: hideToolTip,
          'data-value':  JSON.stringify(datum),
          'data-type': datum.event_id,
          'data-start': datum.start || '',
          'data-end': datum.end || ''
        };
        return <rect {...rect_props}/>;

      } 
      else {
        let cir_props = {
          key: `${datum.event_id}_${index}`,
          cx: xScale(new Date(datum.start)),
          cy: yScale(datum.event_id) + yScale.bandwidth() / 2,
          r:  yScale.bandwidth() / 2,
          fill: color,
          onMouseOver: showToolTip,
          onMouseOut: hideToolTip,
          'data-value': JSON.stringify(datum),
          'data-type': datum.label,
          'data-start': datum.start || '',
          'data-end': datum.end || ''
        };
        return <circle {...cir_props}/>;
      }
    })

    return <g>{events}</g>;
  }
}

export default TimelineEvents;