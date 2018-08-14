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

class Header extends React.Component{
  render(){
    let {mode, handler, can_edit, can_close, children} = this.props;
    let elem = null;

    if(mode == 'edit'){
      elem = <HeaderApprove handler={handler} />;
    }
    else if(mode == 'submit'){
      elem = <HeaderWaiting />;
    }
    else if(can_edit){
      elem = <HeaderEdit handler = {handler} />
    }

    return(
      <div className='header'>

        {children}
        <div className='inline'>

          <button className='header-edit-btn'>

            <i className='fas fa-download' aria-hidden='true' ></i>
            &nbsp;{'DOWNLOAD ALL'}
          </button>
        </div>
        {elem}
        {can_close ? <HeaderClose handler={handler} /> : null}
      </div>
    );
  }
}

export default Header;
