import React from 'react';

//将SignInForm 改成一个函数
export default function (props) {
  return (
    <form className="signIn" onSubmit={props.onSubmit}> {/* 登录*/}
      <div className="row">
        <label>用户名</label>
        <input type="text" value={props.formData.username}
               onChange={props.onChange.bind(null, 'username')}/>
      </div>
      <div className="row">
        <label>密码</label>
        <input type="password" value={props.formData.password}
               onChange={props.onChange.bind(null, 'password')}/>
      </div>
      <div className="row actions">
        <button type="submit">登录</button>
      </div>
      <div className="row actions">
        <a onClick={props.onForgotPassword}>找回密码</a>
      </div>
    </form>
  )
}
