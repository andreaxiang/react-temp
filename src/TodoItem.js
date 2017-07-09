import React, { Component } from 'react';
import './TodoItem.css'

export default class TodoItem extends Component {
  render() {
    return (
      <div className="TodoItem">
        <input type="checkbox"
               checked={this.props.todo.status === 'completed'}
               onChange={this.toggle.bind(this)} />
        <label className="title">
          {this.props.todo.title}
        </label>
        <a className="del-btn" onClick={this.delete.bind(this)}><i className="icon">&#xe604;</i></a>
      </div>
    )
  }

  toggle(e) {
    this.props.onToggle(e, this.props.todo)
  }

  delete(e) {
    this.props.onDelete(e, this.props.todo)
  }
}