// Framework libraries.
import * as React from 'react';

class HeaderApprove extends React.Component{
  render(){
    let {handler} = this.props;
    return(
      <div className='inline'>

        <button className='header-edit-btn' onClick={handler.bind(null, 'cancel')}>

          <span className='far fa-times-circle'></span>
          &nbsp;{'CANCEL'}
        </button>
        <button className='header-edit-btn' onClick={handler.bind(null, 'approve')}>

          <span className='fas fa-check'></span>
          &nbsp;{'SAVE'}
        </button>
      </div>
    );
  }
}

class HeaderWaiting extends React.Component{
  render(){
    return(
      <div className='inline'>

        <div className='submit'>

          <span className='fas fa-spinner' />
        </div>
      </div>
    );
  }
}

class HeaderEdit extends React.Component{
  render(){
    let {handler} = this.props;
    return(
      <div className='inline'>

        <button className='header-edit-btn' onClick={handler.bind(null, 'edit')}>

          <span className='far fa-edit'></span>
          &nbsp;{'EDIT'}
        </button>
      </div>
    );
  }
}

class HeaderClose extends React.Component{
  render(){
    let {handler} = this.props;
    return(
      <div className='inline'>

        <button className='header-edit-btn' onClick={handler.bind(null, 'close')}>

          <span className='far fa-times-circle'></span>
          &nbsp;{'CLOSE'}
        </button>
      </div>
    );
  }
}

class HeaderDownload extends React.Component{
  render(){
    let {handler} = this.props;
    return(
      <div className='inline'>

        <button className='header-edit-btn' onClick={handler.bind(null, 'download')}>

          <span className='fas fa-download'></span>
          &nbsp;{'DOWNLOAD'}
        </button>
      </div>
    );
  };
}

class Header extends React.Component{
  render(){
    let {mode, handler, can_edit, can_close, children, download} = this.props;
    let edit_elem, dwlnd_elem = null;

    if(mode == 'edit'){
      edit_elem = <HeaderApprove handler={handler} />;
    }
    else if(mode == 'submit'){
      edit_elem = <HeaderWaiting />;
    }
    else if(can_edit){
      edit_elem = <HeaderEdit handler = {handler} />
    }

    if(download) dwlnd_elem = <HeaderDownload handler = {handler} />

    return(
      <div className='header'>

        {children}
        <div className='inline' style={{display: 'none'}}>

          <button className='header-edit-btn'>

            <i className='fas fa-download' aria-hidden='true' ></i>
            &nbsp;{'DOWNLOAD ALL'}
          </button>
        </div>
        {edit_elem}
        {dwlnd_elem}
        {can_close ? <HeaderClose handler={handler} /> : null}
      </div>
    );
  }
}

export default Header;
