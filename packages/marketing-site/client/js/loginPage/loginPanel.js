import React from 'react'
import GHLogo from './ghLogo'

const LoginPanel = () => {
  return (
    <div className="login-panel">
      <a className="login-link" href="/auth">
        Login with Github
        <GHLogo width={ '30px' } height={ '30px' }/>
      </a>
    </div>
  )
}

export default LoginPanel
