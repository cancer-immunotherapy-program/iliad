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
      this.props.set_page(
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
      onEnter: this.enterPage.bind(this)
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
/*
  renderLeft() {
    if(this.props.current_page > 1){
      return <button className='pager-nav-btn active fas fa-chevron-left' onClick={this.rewindPage.bind(this)} />;
    }
    else{
      return <button className='pager-nav-btn inactive fas fa-chevron-left' />;
      return(
        <button className='pager-nav-btn inactive'>

          <span className='fas fa-chevron-left' />
        </button>
      );
    }
  }
  */

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

/*
    if(this.props.current_page < this.props.pages){
      return(
        <button className='pager-nav-btn active' onClick={this.advancePage.bind(this)}>

          <span className='fas fa-chevron-right' />
        </button>
      );
    }
    else{
      return(
        <button className='pager-nav-btn inactive'>

          <span className='fas fa-chevron-right' />
        </button>
      );
    }
*/
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

/*
import React, { Component } from 'react';

class Pager extends Component {
  constructor() {
    super();
    this.state = { editing: false }
  }

  rewindPage() {
    if (this.props.current_page > 1)
      this.props.set_page(this.props.current_page - 1);
  }

  advancePage() {
    if (this.props.current_page < this.props.pages)
      this.props.set_page(this.props.current_page + 1);
  }

  enterPage() {
    let page_edit = parseInt(this.refs.page_edit.value)
    if (page_edit == this.refs.page_edit.value) {
      this.props.set_page(
        Math.max( 1, Math.min( this.props.pages, page_edit ) )
      )
    }
    this.setState({ editing: false })
  }

  renderReport() {
    return <div className='report' onClick={ () => this.setState({ editing: true }) } >
      Page {
        this.state.editing
          ? <input className='page_edit'
            ref='page_edit'
            type='text'
            defaultValue={ this.props.current_page }
            autoFocus
            onBlur={ this.enterPage.bind(this) }
            onEnter={ this.enterPage.bind(this) } />
          : this.props.current_page
      } of { this.props.pages }
    </div>
  }

  renderLeft() {
    if (this.props.current_page > 1) {
      return <span className='turner active fas fa-chevron-left' onClick={ this.rewindPage.bind(this) } />
    } else {
      return <span className='turner inactive fas fa-chevron-left'/>
    }
  }

  renderRight() {
    if (this.props.current_page < this.props.pages) {
      return <span className='turner active fas fa-chevron-right' onClick={ this.advancePage.bind(this) }/>
    } else {
      return <span className='turner inactive fas fa-chevron-right'/>
    }
  }

  render() {
    return <div className='pager'>
      { this.renderLeft() }
      { this.renderReport() }
      { this.renderRight() }
      { this.props.children }
      </div>
  }
}

module.exports = Pager;
*/
