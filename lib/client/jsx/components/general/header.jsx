// Framework libraries.
import * as React from 'react';

class Header extends React.Component{

  renderButton(name, onClick, icons){
    return(
      <div className='inline'>

        <button className='header-edit-btn' onClick={onClick}>

          <span className={icons}></span>
          &nbsp;{name.toUpperCase()}
        </button>
      </div>
    )
  }

  render(){
    let {onApprove, onClose, onCancel, onEdit, onLoad, children} = this.props;

    return(
      <div className='header'>

        {children}
        {onEdit && this.renderButton('edit', onEdit, ['far fa-edit'])}
        {onCancel && this.renderButton('cancel', onCancel, ['far fa-times-circle'])}
        {onApprove && this.renderButton('approve', onApprove, ['fas fa-check'])}
        {onClose && this.renderButton('close', onClose, ['far fa-times-circle'])}
      </div>
    )
  }
}

export default Header;
