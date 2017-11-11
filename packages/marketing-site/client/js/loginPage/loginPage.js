import React, { Component } from 'react'
import Masthead from './masthead'
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
        <Masthead
          showInfo={ this.state.infoPanelOpen }
          toggleInfoPanel={ this.toggleInfoPanel }
        />
        <LoginPanel />
      </div>
    )
  }
}
