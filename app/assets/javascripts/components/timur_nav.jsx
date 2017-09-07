import * as React from 'react';
import IdentifierSearch from './identifier_search';
import {toggleConfig, changeMode} from '../actions/timur_actions';

class TimurNav extends React.Component{
  constructor(props){
    super(props);
    this['state'] = {'open': false};
  }

  renderTabs(){
    var tabs = {
      browse: Routes.browse_path(PROJECT_NAME),
      search: Routes.search_path(PROJECT_NAME),
      map: Routes.map_path(PROJECT_NAME),
      manifest: Routes.manifests_path(PROJECT_NAME),
    }

    return(
      Object.keys(tabs).map((name)=>{
        return(
          <a className='nav-menu-btn' key={Math.random()} href={tabs[name]}>

            {name}
          </a>
        );
      })
    );
  }

  renderActivityTab(){
    return null;
    if(!this.props.can_edit) return null;

    return(
      <a className='nav-menu-btn' href='#'>

        {'ACTIVITY'}
      </a>
    );

    /* Need to fix activity_path
    return(
      <a className='nav-menu-btn' href={Routes.activity_path()}>

        {'Activity'}
      </a>
    );
    */
  }

  renderHelpTab(){
    return null;
    var help_props = {
      'className': 'nav-menu-btn',
      'href': '#',
      'onClick': (e)=>{
        this.props.toggleConfig('help_shown');
      }
    };

    return(
      <a {...help_props}>

        {this.props.helpShown ? 'HIDE HELP' : 'HELP'}
      </a>
    );
  }

  toggleUserPanel(){
    var open = (this['state']['open']) ? false : true;
    this.setState({'open': open});
  }

  closeUserPanel(event){
    this.setState({'open': false});
  }

  renderUserMenu(){
    var height = (this['state']['open']) ? 'auto' : '100%';
    var userDropdownGroupProps = {
      'className': 'user-menu-dropdown-group',
      'style': {'height': height},
      'onMouseLeave': this['closeUserPanel'].bind(this)
    };

    var userMenuButtonProps = {
      'className': 'user-menu-dropdown-btn',
      'onClick': this['toggleUserPanel'].bind(this)
    };

<<<<<<< HEAD
    return(
      <div {...userDropdownGroupProps}>

        <button {...userMenuButtonProps}>

          {this.props.user}
          <div className='user-menu-arrow-group'>

            <i className='fa fa-caret-down' aria-hidden='true'></i>
          </div>
        </button>
        <div className='user-dropdown-menu'>

          <div className='user-dropdown-menu-item'>

            {'LOG OUT'}
          </div>
        </div>
      </div>
    );
  }

  render(){

    return(
      <div id='header-container'>

        <div id='title-menu'>

          <button className='title-menu-btn'>

            {'Timur'}
            <br />
            <span className='title-menu-btn-sub'>

              {'DATA BROWSER'}
            </span>
          </button>
          <img id='ucsf-logo' src='/assets/ucsf_logo_dark.png' alt='' />
        </div>
        <div id='nav-menu'>

          {this.renderUserMenu()}
          <IdentifierSearch project_name={this.props.project_name} />
          {this.renderHelpTab()}
          {this.renderActivityTab()}
          {this.renderTabs()}
        </div>
        <div className='logo-container'>

          <img src='/assets/timur_logo_basic.png' alt='' />
        </div>
      </div>
    );
=======
    //TODO fix hacky addition of Manifesto tab
    return <div id="header">
             <div id="logo">
               <a href="/">
                 <div id={ logo_id }
                   className={ Object.keys(this.props.exchanges).length > 0 ? "throb" : null }
                 >
                   <div className="image"/>
                   <div className="halo">
                     <svg>
                       <circle r="25px" cx="35" cy="35"/>
                       {
                         Array(36).fill().map((_,i) => {
                           let x = (d,r) => Math.cos(Math.PI * d / 180) * r + 35
                           let y = (d,r) => Math.sin(Math.PI * d / 180) * r + 35
                           return <path className={ i%2==0 ? "long" : "short"} key={i} d={ `M ${x(i*10, (i%2==0 ? 42 : 32))}, ${y(i*10, (i%2==0 ? 42 : 32)) }
                                  L ${x(i*10,25)}, ${y(i*10, 25)}` }/>
                         
                         })
                       }
                     </svg>
                   </div>
                 </div>
               </a>
             </div>
             <div id="help_float">
                 <Help info="timur"/>
              </div>
             <div id="heading">
               { heading }
             </div>
             <div id="nav">
               {
                 Object.keys(tabs).map((name) =>
                   <div key={ name } 
                     className={ "nav_tab" + ((this.props.mode == name && !this.props.appMode) ? ' selected' : '') }>
                       <a href={ tabs[name] }> { name } </a>
                     </div>
                 )
               }

               {
                 this.props.can_edit ?
                 <div className="nav_tab">
                   <a href={ Routes.activity_path(PROJECT_NAME) }>Activity</a>
                 </div>
                 : null
               }
               <div className="nav_tab">
                 <a onClick={ (e) => this.props.toggleConfig('help_shown') }>
                 {
                   this.props.helpShown ? 'Hide Help' : 'Help'
                 }
                 </a>
               </div>
               <IdentifierSearch/>
               <div id="login">
                 { login }
               </div>
             </div>
           </div>
>>>>>>> etna-integration
  }
}

const mapStateToProps = (state, ownProps)=>{

  return {
    'helpShown': state.timur.help_shown,
    'exchanges': state.exchanges,
  };
};

const mapDispatchToProps = (dispatch, ownProps)=>{
  return {

    changeMode: function(){
      dispatch(changeMode());
    },

    toggleConfig: function(){
      dispatch(toggleConfig());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimurNav);
