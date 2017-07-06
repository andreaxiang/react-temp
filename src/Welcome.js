import React from 'react';
class Welcome extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      date: new Date()
    }
    setInterval(()=>{
      this.setState({
        date: new Date() //更新date
      })
    })
    console.log('我已经在 constructor 里将 props 和 state 初始化好了')
  }

  componentWillMount(){
    console.log('马上运行render了')
  }

  render(){
    console.log('这里是render')
    return (
      <div>
        <h1>Hello,this is {this.props.name}</h1>
        <h2>{this.state.date.toString()}</h2>
      </div>
    )
  }
  componentDidMount(){
    console.log('已经挂载至页面了')
  }
}

export default Welcome;