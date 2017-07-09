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
        <header className="row">
          <a><i className="icon">&#xe639;</i></a>
          <span>{this.props.user}</span>
          <div className="user-info">
            <a onClick={this.props.onSignOut.bind(null)} className="row logout"><i className="icon">&#xe606;</i> 退出登录</a>
          </div>
        </header>
        <section className="row" onClick={this.onShowComplete.bind(this)}><i className="icon"></i> 已完成</section>
        <section className="row"><i className="icon"></i> 其他功能</section>
      </section>
    )
  }
  onShowComplete(){
    this.props.onShowComplete()
  }
}
