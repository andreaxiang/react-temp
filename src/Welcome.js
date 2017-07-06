import React from 'react';
class Welcome extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
      test: '1'
    }
    this.setState({
      date: new Date(), //更新date
      test: 'constructor'
    })
    console.log('我已经在 constructor 里将 props 和 state 初始化好了')
  }

  componentWillMount() {
    this.setState({
      date: new Date(), //更新date
      test: 'componentWillMount'
    })
    console.log('马上就要运行render了')
  }

  render() {
    this.setState({
      date: new Date(), //更新date
      test: 'render'
    })
    console.log('这里是render')
    return (
      <div>
        <h1>Hello,this is {this.props.name}</h1>

        <h2>{this.state.date.toString()}</h2>

        <p>{test}</p>
      </div>
    )
  }

  componentDidMount() {
    this.setState({
      date: new Date(), //更新date
      test: 'componentDidMount'
    })
    console.log('已经挂载至页面了')
  }

  componentWillReceiveProps() {
    this.setState({
      date: new Date(), // 更新 date
      test: 'componentWillReceiveProps'
    })
  }

  shouldComponentUpdate() {
    this.setState({
      date: new Date(), // 更新 date
      test: 'shouldComponentUpdate'
    })
  }

  componentWillUpdate() {
    this.setState({
      date: new Date(), // 更新 date
      test: 'componentWillUpdate'
    })
  }

  componentDidUpdate() {
    this.setState({
      date: new Date(), // 更新 date
      test: 'componentDidUpdate'
    })
  }

  componentWillUnmount() {
    console.log('要死了')
  }
}

export default Welcome;