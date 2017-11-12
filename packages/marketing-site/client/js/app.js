import ReactDOM from 'react-dom'
import { Component } from 'react'
import Splash from './splash/splash'
import Masthead from './masthead'
import LoginPage from './loginPage/loginPage'
import UserAcctPage from './userAcctPage/userAcctPage'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userObj: this.userObj,
      isLoggedIn: Boolean(this.userObj.name),
      firstTime: false
    }
  }

  userObj = {}

  componentDidMount() {
    this.userObj = fetch('/v1/users/current', {
      credentials: 'same-origin'
    }).then(res => {
      const response = res.json()
      console.log(response)
      return response
    }).then(res => {
      this.setState({ userObj: res, isLoggedIn: Boolean(res.name) })
    })
    console.log('this.userObj', this.userObj)
  }

  render() {
    const avatar = this.state.userObj && this.state.userObj.avatar,
      username = this.state.userObj && this.state.userObj.name,
      badgeLink = this.state.userObj && this.state.userObj.badge
    return (
      <div className="page">
        { this.state.firstTime ?
          <Splash /> :
          <Masthead /> }
        { this.state.isLoggedIn ?
          <UserAcctPage
            username={ username }
            avatar={ avatar }
            badgeLink={ badgeLink }
          /> :
          <LoginPage /> }
      </div>
    )
  }

}

ReactDOM.render(<App />, document.getElementById('root'))
