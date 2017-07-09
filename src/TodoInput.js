import React from 'react';
import './TodoInput.css';

function submit (props, e) {
  if (e.key === 'Enter') {
    if(e.target.value.trim() !== ''){
      props.onSubmit(e)
    }else{
      alert('乖 别闹 Y(^_^)Y')
    }
  }
}

function changeTitle (props, e) {
  props.onChange(e)
}

export default function (props) {
  return <input className="TodoInput" type="text" value={props.content}
           onChange={changeTitle.bind(null, props)}
           onKeyPress={submit.bind(null, props)}
           placeholder="输入事项，回车或按Enter添加"/>
}