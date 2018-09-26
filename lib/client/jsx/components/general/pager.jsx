// Framework libraries.
import * as React from 'react';

class Pager extends React.Component{
  constructor(){
    super();
    this.state = {editing: false};
  }

  rewindPage(){
    if(this.props.current_page > 1){
      this.props.setPage(this.props.current_page - 1);
    }
  }

  advancePage(){
    if(this.props.current_page < this.props.pages){
      this.props.setPage(this.props.current_page + 1);
    }
  }

  enterPage(){
    let page_edit = parseInt(this.refs.page_edit.value);
    if(page_edit == this.refs.page_edit.value){
      this.props.setPage(
        Math.max(1, Math.min(this.props.pages, page_edit))
      );
    }
    this.setState({editing: false});
  }

  renderReport(){
    let input_props = {
      className: 'page_edit',
      ref: 'page_edit',
      type: 'text',
      defaultValue: this.props.current_page,
      onBlur: this.enterPage.bind(this),
      onKeyUp: (event)=>{
        event.preventDefault();
        if(event.keyCode === 13){
          this.enterPage();
        }
      }
    };
    let input = <input {...input_props} />
    let report = `${this.props.current_page} of ${this.props.pages}`;

    return(
      <div className='pager-nav-report' onClick={()=>this.setState({editing: true})}>

        {'Page '}
        {(this.state.editing) ? input : report}
      </div>
    );
  }

  renderLeft(){
    let btn_props = {className: 'pager-nav-btn active'};
    if(this.props.current_page > 1){
      btn_props['className'] += ' active';
      btn_props['onClick'] = this.rewindPage.bind(this);
    }

    return(
      <button {...btn_props}>

        <span className='fas fa-chevron-left' />
      </button>
    );
  }

  renderRight(){
    let btn_props = {className: 'pager-nav-btn active'};
    if(this.props.current_page < this.props.pages){
      btn_props['className'] += ' active';
      btn_props['onClick'] = this.advancePage.bind(this);
    }

    return(
      <button {...btn_props}>

        <span className='fas fa-chevron-right' />
      </button>
    );
  }

  render(){
    return(
      <div className='pager-group'>

        {this.renderLeft()}
        &nbsp;&nbsp;{this.renderReport()}&nbsp;&nbsp;
        {this.renderRight()}
        {this.props.children}
      </div>
    );
  }
}

export default Pager;
