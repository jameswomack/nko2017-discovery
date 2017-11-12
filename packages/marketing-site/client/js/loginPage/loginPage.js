import React, { Component } from 'react'
import LoginPanel from './loginPanel'

export default class LoginPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      infoPanelOpen: false
    }
  }

  toggleInfoPanel = () => {
    this.setState(prev => {
      return { infoPanelOpen: !prev.infoPanelOpen }
    })
  }

  render() {
    return (
      <div className="landing-page">
        <LoginPanel />
      </div>
    )
  }
}
