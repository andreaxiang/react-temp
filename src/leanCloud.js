import AV from 'leancloud-storage';

var APP_ID = 'aQ9824hhWRrhe0w4sYNsKh2n-gzGzoHsz';
var APP_KEY = 'S9GjlavvSp4fS7yrFGN9G7lv';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})

export default AV

//所有跟Todo相关的 LeanCloud 操作都放到这里
export const TodoModel = {
  getByUser(user, successFn, errorFn){
    // 文档见 https://leancloud.cn/docs/leanstorage_guide-js.html#批量操作
    let query = new AV.Query('Todo')
    query.find().then((response)=>{
      let array = response.map((t)=>{
        return {id: t.id, title: t.attributes.title, status: t.attributes.status, deleted: t.attributes.deleted }
      })
      successFn.call(null, array)
    }, (error)=>{
      errorFn && errorFn.call(null, error)
    })
  },
  create({status, title, deleted}, successFn, errorFn){
    let Todo = AV.Object.extend('Todo')
    let todo = new Todo()
    todo.set('title', title)
    todo.set('status', status)
    todo.set('deleted', deleted)

    // 根据文档 https://leancloud.cn/docs/acl-guide.html#单用户权限设置
    // 这样做就可以让这个Todo只被当前用户看到
    let acl = new AV.ACL()
    acl.setPublicReadAccess(false)
    acl.setWriteAccess(AV.User.current(), true)

    todo.setACL(acl);

    todo.save().then(function (response){
      successFn.call(null, response.id)
    }, function (error){
      errorFn && errorFn.call(null, error)
    })
  },
  update({id, title, status, deleted}, successFn, errorFn){
    // 文档 https://leancloud.cn/docs/leanstorage_guide-js.html#更新对象
    let todo = AV.Object.createWithoutData('Todo', id)
    title !== undefined && todo.set('title', title)
    status !== undefined && todo.set('status', status)
    deleted !== undefined && todo.set('deleted', deleted)

    todo.save().then((response)=>{
      successFn && successFn.call(null)
    }, (error)=> errorFn && errorFn.call(null, error))
  },
  destroy(todoId, successFn, errorFn){
    // 文档 https://leancloud.cn/docs/leanstorage_guide-js.html#删除对象
    let todo = AV.Object.createWithoutData('Todo', todoId)
    todo.destroy().then(function (response){
      successFn && successFn.call(null)
    }, function (error){
      errorFn && errorFn.call(null, error)
    });
  }
}

export function signUp (username, email, password, successFn, errorFn){
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

export function signIn (username, password, successFn, errorFn) {
  AV.User.logIn(username, password).then(function (loginedUser) {
    let user = getUserFromAVUser(loginedUser)
    successFn.call(null, user)
  }, function (error) {
    errorFn.call(null, error)
  })
}

export function getCurrentUser () {//从缓存里读取上次登录信息
  let user = AV.User.current()
  if (user) {
    return getUserFromAVUser(user)
  } else {
    return null
  }
}

export function signOut () {
  AV.User.logOut()
  return undefined
}

export function sendPasswordResetEmail (email, successFn, errorFn) {
  AV.User.requestPasswordReset(email).then(function (success) {
    successFn.call()
  }, function (error) {
    error.call(null, error)
  })
}

  function getUserFromAVUser (AVUser) {
    return {
      id: AVUser.id,
      username: AVUser.attributes.username,
      email: AVUser.attributes.email,
      password: AVUser.attributes.password
    }
  }