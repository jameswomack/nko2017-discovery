import React, { Component } from 'react'

export default class Masthead extends Component {
  login () {
    window.location = `/auth`
  }
  render() {
    return (
      <header className="masthead">
        <div className="heading-container">
          <h1 className="title-heading">Office Hours</h1>
          <p>Live video chat with the open-source maintainers who craft the libraries that power your company.</p>
          <button onClick={this.login} className="secondary-button login-mini-button top-right-corner">login</button>
        </div>
      </header>
    )
  }
}
