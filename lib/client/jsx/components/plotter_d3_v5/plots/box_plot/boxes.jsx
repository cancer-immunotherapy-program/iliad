
import React, {Component} from 'react';
import * as d3 from 'd3';
import {interpolateLab} from 'd3-interpolate';

class Boxes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    }
  }

  toggleHover() {
    this.setState({hover: !this.state.hover})
  }

  render() {
    let {y_min_max, groups, scales, color_range} = this.props;
    let {xScale, yScale} = scales;

    let colorScale = d3.scaleLinear()
      .domain(y_min_max)
      .range(color_range)
      .interpolate(interpolateLab);

    let boxes = groups.map(group => {
      let bar_height = yScale(group.inliers.quartile_data[0]) 
        - yScale(group.inliers.quartile_data[2]);
      let width = xScale.bandwidth();
      let x_position = xScale(group.label) + (xScale.bandwidth() / 2);
      let median = yScale(group.inliers.quartile_data[1]);
      let y_min_scale = yScale(group.inliers.whisker_min);
      let y_max_scale = yScale(group.inliers.whisker_max);

      let outliers = group.outliers.map((outlier, index) => {

        let outlier_props = {
          key: `outlier_${index}`,
          'data-type': 'outlier',
          'data-datum': JSON.stringify({
            outlier,
            metrics: {left: x_position, top: yScale(outlier), width: 3}}),
          r: 3,
          cx: x_position,
          cy: yScale(outlier),
          stroke: '#333333',
          fill: 'none'
        }
        return <circle {...outlier_props} />
      });

      let center_props = {
        key: `${group.label}_stem`,
        x1: x_position,
        x2: x_position,
        y1: y_max_scale,
        y2: y_min_scale,
        stroke: '#333333',
        'strokeDasharray': '5, 5',
        'strokeWidth': '0.5'
      }

      let whisker_lower_props = {
        key: `${group.label}_whisker_lower`,
        x1: x_position - (width / 2),
        x2: x_position + (width / 2),
        y1: y_min_scale ,
        y2: y_min_scale ,
        stroke: '#333333'
      }

      let median_props = {
        key: `${group.label}_median`,
        x1: x_position - (width / 2),
        x2: x_position + (width / 2),
        y1: median,
        y2: median,
        stroke: '#333333'
      }

      let whisker_upper_props = {
        key: `${group.label}_whisker_upper`,
        x1: x_position - (width / 2),
        x2: x_position + (width / 2),
        y1: y_max_scale,
        y2: y_max_scale,
        stroke: '#333333'
      }

      let rect_props = {
        key: group.label,
        x: xScale(group.label),
        y: yScale(group.inliers.quartile_data[2]),
        height: bar_height,
        width: xScale.bandwidth(),
        fill: colorScale(group.inliers.quartile_data[1]),
        stroke: colorScale(group.inliers.quartile_data[2]),
      }

      let upper_quartile_props = {
        visibility: this.state.hover ? 'visible' : 'hidden',
        x: xScale(group.label) - (2 * width),
        y: yScale(group.inliers.quartile_data[2]),
        'fontSize': '8',
        'alignmentBaseline': "middle"
      }

      let median_quartile_props = {
        visibility: this.state.hover ? 'visible' : 'hidden',
        x: xScale(group.label) - (2 * width),
        y: yScale(group.inliers.quartile_data[1]),
        'fontSize': '8',
        'alignmentBaseline': "middle"
      }

      let lower_quartile_props = {
        visibility: this.state.hover ? 'visible' : 'hidden',
        x: xScale(group.label) - (2 * width),
        y: yScale(group.inliers.quartile_data[0]),
        'fontSize': '8',
        'alignmentBaseline': "middle"
      }

      let whisker_min_props = {
        visibility: this.state.hover ? 'visible' : 'hidden',
        x: xScale(group.label) - (2 * width),
        y: yScale(group.inliers.whisker_min),
        'fontSize': '8',
        'alignmentBaseline': "middle"
      }

      let whisker_max_props = {
        visibility: this.state.hover ? 'visible' : 'hidden',
        x: xScale(group.label) - (2 * width),
        y: yScale(group.inliers.whisker_max),
        'fontSize': '8',
        'alignmentBaseline': "middle"
      }

      let g_props = {
        onMouseOver: this.toggleHover.bind(this), 
        onMouseOut: this.toggleHover.bind(this)
      }

      return (
        <g {...g_props}>
        <line {...center_props} />
        <rect {...rect_props} />
        <line {...whisker_upper_props} />
        <line {...median_props} />
        <line {...whisker_lower_props} />
        <text {...upper_quartile_props}>{group.inliers.quartile_data[2].toFixed(2)} </text>
        <text {...median_quartile_props}>{group.inliers.quartile_data[1].toFixed(2)} </text>
        <text {...lower_quartile_props}>{group.inliers.quartile_data[0].toFixed(2)}</text>
        <text {...upper_quartile_props}>{group.inliers.quartile_data[2].toFixed(2)} </text>
        <text {...median_quartile_props}>{group.inliers.quartile_data[1].toFixed(2)} </text>
        <text {...lower_quartile_props}>{group.inliers.quartile_data[0].toFixed(2)}</text>
        <text {...whisker_min_props}>{group.inliers.whisker_min.toFixed(2)} </text>
        <text {...whisker_max_props}>{group.inliers.whisker_max.toFixed(2)}</text>
        
        {outliers}
        </g>
      )
    });

    return <g>{boxes}</g>;
  }
};

export default Boxes;