import React, { Component } from 'react'

class OfficeHrsForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      officeHrs: ''
    }
  }

  submitHrs = e => {
    e.preventDefault()
    if (this.state.officeHrs) {
      const officeHrs = `{"officeHrs": "${this.state.officeHrs}"}`,
        endpoint = '/v1/users/current',
        http = new XMLHttpRequest()
      http.open('POST', endpoint)
      http.onreadystatechange()
      http.send(officeHrs)
      console.log(JSON.parse(officeHrs))
    } else return
  }

  inputHrs = e => {
    const officeHrs = e.target.value
    this.setState({ officeHrs })
  }

  render() {
    return (
      <div className="set-office-hours">
        <form
          className="office-hrs-form"
          onSubmit={ this.submitHrs }
        >
          <label>
            <span className="form-heading">Tell us when your office hours are</span>
            <textarea
              placeholder="What are your hours of availability?"
              onChange={ this.inputHrs }
            ></textarea>
            <div className="button-container">
              <button className="primary-button submit-hrs" type="submit">Submit</button>
            </div>
          </label>
        </form>
      </div>
    )
  }
}

export default OfficeHrsForm
