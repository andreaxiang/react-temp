import AV from 'leancloud-storage';

var APP_ID = 'aQ9824hhWRrhe0w4sYNsKh2n-gzGzoHsz';
var APP_KEY = 'S9GjlavvSp4fS7yrFGN9G7lv';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})

export default AV

export function signUp(username, email, password, successFn, errorFn) {
  // 新建 AVUser 对象实例
  var user = new AV.User()
  // 设置用户名
  user.setUsername(username)
  // 设置邮箱
  user.setEmail(email)
  // 设置密码
  user.setPassword(password)

  //正则判断用户注册信息
  if (/^\w+@[\w-]+\.\w+(\.\w+)?$/.test(email)) {
    if (/\w{3,}/.test(username)) {
      if (/\w{6,}/.test(password)) {
        user.signUp().then(function (loginedUser) { //注册成功返回当前用户信息
          let user = getUserFromAVUser(loginedUser)
          successFn(user)
        }, function (error) {
          errorFn(error)
        });
      } else {
        alert("密码不能小于6个字符")
      }

    } else {
      alert("用户名必须大于3个字符")
    }
  } else{
    alert("邮箱格式不正确")
  }
}
export function signIn(username, password, successFn, errorFn) {
  AV.User.logIn(username, password).then(function (loginedUser) {
    let user = getUserFromAVUser(loginedUser)
    successFn.call(null, user)
  }, function (error) {
    errorFn.call(null, error)
  })
}

export function getCurrentUser() {//从缓存里读取上次登录信息
  let user = AV.User.current()
  if (user) {
    return getUserFromAVUser(user)
  } else {
    return null
  }
}

export function signOut() {
  AV.User.logOut()
  return undefined
}

/*export function sendPasswordResetEmail (email, successFn, errorFn) {
  AV.User.requestPasswordReset(email).then(function (success) {
    alert('发送成功，请注意查收邮件并确认')
  }, function (error) {
    errorFn.call(null, error)
  })
}*/

  function getUserFromAVUser(AVUser) {
    return {
      id: AVUser.id,
      username: AVUser.attributes.username,
      email: AVUser.attributes.email,
      password: AVUser.attributes.password
    }
  }