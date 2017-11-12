import React, { Component } from 'react'
import Masthead from '../masthead'
import UserCard from './userCard'
import OfficeHrsForm from './officeHrsForm'
import GetBadgeLink from './getBadgeLink'

export default class UserAcctPage extends Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    return (
      <div className="account-page">
        <Masthead />
        <UserCard username={ this.props.username } userpic={ this.props.pic }/>
        <OfficeHrsForm />
        <GetBadgeLink />
        <button>Start Office Hours</button>
      </div>
    )
  }
}
