// Framework libraries.
import * as React from 'react';

import Link from './link';

export default class MagmaLink extends React.Component{

  render(){
    let route_args = [
      APP_CONFIG.project_name,
      this.props.model,
      encodeURIComponent(this.props.link)
    ];

    let link_props = {
      className: 'link',
      link: Routes.browse_model_path(...route_args),
      name: this.props.link
    };

    return <Link {...link_props} />;
  }
}
