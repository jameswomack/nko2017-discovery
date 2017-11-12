import React, { Component } from 'react'
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
        <UserCard
          username={ this.props.username }
          avatar={ this.props.avatar }
        />
        <OfficeHrsForm />
        <GetBadgeLink
          badgeLink={ this.props.badgeLink }
        />
        <button className="primary-button go-button">Start Office Hours</button>
      </div>
    )
  }
}
