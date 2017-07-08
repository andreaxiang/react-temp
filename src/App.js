import React, { Component } from 'react';
import './App.css';
import TodoInput from './TodoInput';
import TodoItem from './TodoItem';
import 'normalize.css';
import './reset.css';
import UserDialog from './UserDialog.js';
import {getCurrentUser, signOut} from './leanCloud.js';
import AV from './leanCloud';

// 声明类型
var TodoFolder = AV.Object.extend('TodoFolder');
// 新建对象
var todoFolder = new TodoFolder();
// 设置名称
todoFolder.set('name','工作');
// 设置优先级
todoFolder.set('priority',1);
todoFolder.save().then(function (todo) {
  console.log('objectId is ' + todo.id);
}, function (error) {
  console.error(error);
});

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: getCurrentUser() || {},
      newTodo: '',
      todoList: []
    }
  }

  render() {
    let todos = this.state.todoList
      .filter((item=> !item.deleted))
      .map((item, index)=> {
        return (
          <li key={index}>
            <TodoItem todo={item}
                      onToggle={this.toggle.bind(this)}
                      onDelete={this.delete.bind(this)}/>
          </li>
        )
      })

    return (
      <div className="App">
        <nav className="header">
          <h1>{this.state.user.username || '我'}的待办清单</h1>
          <a onClick={this.signOut.bind(this)}><i className="icon">&#xe606;</i>退出</a>
        </nav>
        <div className="inputWrapper">
          <TodoInput content={this.state.newTodo}
                     onChange={this.changeTitle.bind(this)}
                     onSubmit={this.addTodo.bind(this)}/>
        </div>
        <ol className="todoList">
          {todos}
        </ol>
        {this.state.user.id ?
          null :
          <UserDialog onSignUp={this.onSignUpOrSignIn.bind(this)}
                      onSignIn={this.onSignUpOrSignIn.bind(this)}/>}
      </div>
    )
  }

  //合并 onSignUp 和 onSignIn
  onSignUpOrSignIn(user) {
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = user
    this.setState(stateCopy)
  }

  signOut() {
    signOut()
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = {}
    this.setState(stateCopy)
  }

  componentDidUpdate() {

  }

  toggle(e, todo) {
    todo.status = todo.status === 'completed' ? '' : 'completed'
    this.setState(this.state)
  }

  changeTitle(event) {
    this.setState({
      newTodo: event.target.value,
      todoList: this.state.todoList
    })
  }

  addTodo(event) {
    this.state.todoList.push({
      id: idMaker(),
      title: event.target.value,
      status: null,
      deleted: false
    })
    this.setState({
      newTodo: '',
      todoList: this.state.todoList
    })
  }

  delete(event, todo) {
    todo.deleted = true
    this.setState(this.state)
  }
}

export default App;

let id = 0
function idMaker() {
  id += 1
  return id
}
