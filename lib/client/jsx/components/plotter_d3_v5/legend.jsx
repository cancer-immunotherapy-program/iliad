import React, {Component} from 'react';

export default class Legend extends Component {
    render() {
      let {labels} = this.props;
      let legend_style = {
        width: '75%',
        'margin-top': '25px',
        'margin-left': 'auto',
      } 
        
      let categories = [];

        for (let item in labels) {

          let color_props = {
            className: 'label-box',
            style: {background: labels[item].color}
          }

          categories.push(
            <div key={labels[item]} className='label-group'>
              <div {...color_props}></div>
              <div className='label-text'>{labels[item].text}</div>
            </div>
          );
        }

        return (
          <div style={legend_style}>
            {categories}
          </div>
        );
    }
}

