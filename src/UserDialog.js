import React, {Component} from 'react';
import './UserDialog.css';
import {signUp, signIn, sendPasswordResetEmail} from './leanCloud';
import SignInOrSignUp from './SignInOrSignUp';
import ForgotPasswordForm from './ForgotPasswordForm';


export default class UserDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'signInOrSignUp', //'forgotPassword'
      formData: {
        username: '',
        email: '',
        password: ''
      }
    }
  }

  signUp(e) {
    e.preventDefault()
    let {username, email, password} = this.state.formData
    let success = (user)=> {
      this.props.onSignUp.call(null, user)
    }
    //判断用户注册信息
    let error = (error)=> {
      switch (error.code) {
        case 201:
          alert("密码不能为空")
          break
        case 202:
          alert("用户名已被占用")
          break
        case 217:
          alert("用户名不能为空")
          break
        case 218:
          alert("密码不能为空")
          break
        default:
          alert(error)
          break
      }
    }
    signUp(username, email, password, success, error)
  }

  signIn(e) {
    e.preventDefault()
    let {username, password} = this.state.formData
    let success = (user)=> {
      this.props.onSignIn.call(null, user)
    }
    //判断用户登录信息
    //正则判断用户注册信息
    let error = (error)=> {
      switch (error.code) {
        case 210:
          alert('用户名与密码不匹配')
          break
        default:
          alert(error)
          break
      }
    }
    signIn(username, password, success, error)
  }

  //将 changeUserName 和 changePassword 和 changeEmail 优化成一个函数 changeFormData
  changeFormData(key, e) {
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.formData[key] = e.target.value
    this.setState(stateCopy)
  }

  render() {
    return (
      <div className="UserDialog-Wrapper">
        <div className="UserDialog">
          {
            this.state.selectedTab === 'signInOrSignUp' ?
              <SignInOrSignUp formData={this.state.formData}
                              onSignIn={this.signIn.bind(this)}
                              onSignUp={this.signUp.bind(this)}
                              onChange={this.changeFormData.bind(this)}
                              onForgotPassword={this.showForgotPassword.bind(this)}
                />
              :

              <ForgotPasswordForm formData={this.state.formData}
                                  onSubmit={this.resetPassword.bind(this)}
                                  onChange={this.changeFormData.bind(this)}
                                  onSignIn={this.returnToSignIn.bind(this)}
                />
          }
        </div>
      </div>
    )
  }

  showForgotPassword() {
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.selectedTab = 'forgotPassword'
    this.setState(stateCopy)
  }

  //重置密码界面的返回登录
  returnToSignIn() {
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.selectedTab = 'signInOrSignUp'
    this.setState(stateCopy)
  }

  resetPassword(e) {
    e.preventDefault()
    sendPasswordResetEmail(this.state.formData.email)
  }
}
