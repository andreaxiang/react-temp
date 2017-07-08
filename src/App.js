import React, { Component } from 'react';
import './App.css';
import TodoInput from './TodoInput';
import TodoItem from './TodoItem';
import 'normalize.css';
import './reset.css';
import UserDialog from './UserDialog';
import {getCurrentUser, signOut, TodoModel} from './leanCloud';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: getCurrentUser() || {},
      newTodo: '',
      todoList: []
    }
    let user = getCurrentUser()
    if (user) {
      TodoModel.getByUser(user, (todos)=> {
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.todoList = todos
        this.setState(stateCopy)
      })
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
        {
          this.state.user.id ?
            null :
            <UserDialog onSignUp={this.onSignUpOrSignIn.bind(this)}
                        onSignIn={this.onSignUpOrSignIn.bind(this)}/>
        }
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
    let newTodo = {
      title: event.target.value,
      status: null,
      deleted: false
    }
    TodoModel.create(newTodo, (id)=> {
      newTodo.id = id
      this.state.todoList.push(newTodo)
      this.setState({
        newTodo: '',
        todoList: this.state.todoList
      })
    }, (error)=> {
      console.log(error)
    })
  }

  delete(event, todo) {
    todo.deleted = true
    this.setState(this.state)
  }
}

export default App;
