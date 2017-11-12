import React from 'react'
import GHLogo from './ghLogo'

const LoginPanel = () => {
  return (
    <div className="login-panel">
      <div className="button-container">
        <a className="login-link" href="/auth">
          Sign Up with Github
          <GHLogo width={ '30px' } height={ '30px' }/>
        </a>
      </div>
    </div>
  )
}

export default LoginPanel
