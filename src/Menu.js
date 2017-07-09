import React, {Component} from 'react';
import './Menu.css';

export default class Menu extends Component {
  constructor(props){
    super(props)
    this.state = {
      selected: ''
    }
  }
  render(){
    return (
      <section className="Menu">
        <div className='user-avatar'>
          <i className="icon">&#xe639;</i>{this.props.user}
        </div>
          <a onClick={this.props.onSignOut.bind(null)}><i className="icon">&#xe606;</i> 退出</a>
      </section>
    )
  }
}

