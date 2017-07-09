import React, { Component } from 'react';
import './App.css';
import TodoInput from './TodoInput';
import TodoItem from './TodoItem';
import 'normalize.css';
import './reset.css';
import UserDialog from './UserDialog';
import AV, {getCurrentUser, signOut, TodoModel} from './leanCloud';
import Menu from './Menu';

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
                      onDelete={this.delete.bind(this)}
                      onEdit={this.edit.bind(this)}
                      onSave={this.saveEditData.bind(this)}
              />
          </li>
        )
      })
    let todosDone = this.state.todoList
      .filter((item)=>!item.deleted && item.status === 'completed')
      .map((item,index)=>{
        return (
          <li key={index} >
            <TodoItem todo={item} onToggle={this.toggle.bind(this)}
                      onSave={this.saveEditData.bind(this)}
                      onEdit={this.edit.bind(this)}
                      onDelete={this.delete.bind(this)} />
          </li>
        )
      })

    return (
      <div className="App">
        <Menu user={this.state.user.username}
              onSignOut={this.signOut.bind(this)}
        />
        <main>
          <nav className="header">
            <h1>{this.state.user.username || '我'}的待办</h1>
            <h1 className="showDate">
              {this.getDate.call(this)}
            </h1>
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
        </main>
      </div>
    )
  }

  getDate(){
    let d = new Date()
    return ( d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() )
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
    let oldStatus = todo.status
    todo.status = todo.status === 'completed' ? '' : 'completed'
    TodoModel.update(todo, ()=>{
      this.setState(this.state)
    }, (error)=>{
      todo.status = oldStatus
      this.setState(this.state)
    })

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
      status: '',
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
    TodoModel.destroy(todo.id, ()=>{
      todo.deleted = true
      this.setState(this.state)
    })
  }

  saveDataToCloud(stateCopy){
    let _this = this
    let id = AV.User.current().get('todoListId')
    let todo = AV.Object.createWithoutData('TodoList',id)
    todo.set('todoList',stateCopy.todoList)
    todo.save().then(function(todo){
      //成功保存至leanCloud之后本地再更新state
      _this.setState(stateCopy)
    }, function(error){
      console.log(error)
    })
  }
  edit(e,todo){
    let index = this.state.todoList.indexOf(todo)
    this.state.todoList[index].title = e.target.innerText
  }
  saveEditData(){
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    this.saveDataToCloud.call(this, stateCopy)
  }
  onShowComplete(){
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.show = 'todosDone'
    this.setState(stateCopy)
  }
}

export default App;
