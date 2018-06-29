
import React, {Component} from 'react';

class Box extends Component {
    render() {
        const {fill, height, width, x, y, datum, fillOpacity} = this.props;

        return (
            <rect
                data-type='box'
                style={this.props.isClickable ? {cursor: 'pointer'} : {}}
                x={x}
                y={y}
                data-datum={
                    JSON.stringify({...datum, titleBar: this.props.titleBar, metrics: {left: x, top: y, width}})
                }
                height={height}
                width={width}
                fillOpacity={fillOpacity}
                fill={fill} />
        );
    }
}

export default Box;