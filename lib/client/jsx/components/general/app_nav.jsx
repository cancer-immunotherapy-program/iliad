// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import {IdentifierSearchContainer as IdentifierSearch} from './identifier_search';
import {toggleConfig} from '../../actions/app_actions';

export class AppNav extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  renderTabs(){
    if(this.props.project == '') return null;

    let tabs = {
      PLOT: Routes.plots_path(this.props.project),
      MANIFEST: Routes.manifests_path(this.props.project),
      MAP: Routes.map_path(this.props.project),
      SEARCH: Routes.search_path(this.props.project),
      BROWSE: Routes.browse_path(this.props.project)
    };

    return (
      Object.keys(tabs).map(name=>{
        const tab_props = {
          className: 'nav-menu-btn',
          key: Math.random(),
          href: `${window.location.origin}${tabs[name]}`
        };

        return <a {...tab_props}>{name}</a>;
      })
    );
  }

  renderNavPath(){
    //Remove all leading and trailing slashes.
    let str = window.location.pathname.replace(/^\/+|\/+$/g, '')

    str = str.replace( /\/|%20/g, (match, i) =>{
      return (match=='/')?' > ': ' ';
    })
    return str.toUpperCase();
  }

  render() {
    if(!this.props.user) return null;

    let activity_props = {
      className: 'nav-menu-btn',
      href: Routes.activity_path(APP_CONFIG.project_name)
    }

    let help_props = {
      className: 'nav-menu-btn',
      onClick: (event)=>{
        this.props.toggleConfig('help_shown');
      }
    }

    return (
      <div id='header-group'>

        <div id='title-menu'>

          <button className='title-menu-btn'>

            {'Iliad'}
            <br />
            <span className='title-menu-btn-sub'>

              {'DATA BROWSER'}
            </span>
          </button>
          <img id='ucsf-logo' src='/img/ucsf_logo_dark.png' alt='' />
        </div>

        <div id='nav-menu'>
          {this.props.mode !== 'home' && this.renderTabs()}
        </div>
        <div className='logo-group'>

          <img src='/img/timur_logo_basic.png' alt='' />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  return {
    user: state.app.user,
    project: state.app.path ? state.app.path.project : '',
    component: state.app.path ? state.app.path.component : '',
    helpShown: state.app.help_shown
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    toggleConfig: (text)=>{
      dispatch(toggleConfig(text));
    }
  };
};

export const AppNavContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(AppNav);
