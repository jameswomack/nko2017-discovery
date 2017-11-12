import React, { Component } from 'react'

export default class Masthead extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  login () {
    window.location = `/auth`
  }

  render() {
    return (
      this.props.mini ?
        <header className="masthead mini-masthead">
          <button
            id="hackbit-vote-widget"
            className="secondary-button mini-button"
          >vote</button>
          <button className="secondary-button mini-button">login</button>
        </header> :      <header className="masthead">
          <div className="heading-container">
            <h1 className="title-heading">Office Hours</h1>
            <p>Live video chat with the open-source maintainers who craft the libraries that power your company.</p>
            <button onClick={this.login} className="secondary-button mini-button top-right-corner">login</button>
          </div>
        </header>
    )
  }
}
