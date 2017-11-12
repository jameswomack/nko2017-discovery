import ReactDOM from 'react-dom'
import { Component } from 'react'
import LoginPage from './loginPage/loginPage'
import UserAcctPage from './userAcctPage/userAcctPage'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userObj: fetch('/v1/users/current').then(res => {
        return res.json()
      }),
      isLoggedIn: false
    }
  }

  render() {
    return (
      this.state.isLoggedIn ?
        <UserAcctPage /> :
        <LoginPage />
    )
  }

}

ReactDOM.render(<App />, document.getElementById('root'))
