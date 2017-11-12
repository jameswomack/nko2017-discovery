import React from 'react'
import { dasherize } from 'prelude-ls/lib/Str'

export default class VideoChat extends React.Component {
  state = {}

  componentDidMount () {
    let host
    let join
    try {
      host = this.props.match.params.host
      join = this.props.match.params.join
    } catch (err) {
      console.warn(err)
    }

    require('./room')().then(room => {
      if (join) room.join(host)
      else if (host) room.host()
    })

    document.addEventListener('participantConnected', e => {
      const participantId = e.detail
      const activeParticipantId = document.getElementById('active-participant').dataset.participantId

      if (participantId !== activeParticipantId)
        this.setState({
          participantId
        })
    })
  }

  render () {
    const { location : { pathname }, match : { params } } = this.props

    const activeParticipant = ['Host', 'Join']
      .reduce((_activeParticipant, ParticipantType) => {
        const participantType = ParticipantType.toLowerCase()
        const isActiveParticipant = pathname.includes(`/${participantType}`)
        isActiveParticipant && (_activeParticipant.participantId = params[participantType])
        return {
          ..._activeParticipant,
          [`is${ParticipantType}`]: isActiveParticipant
        }
      }, { })

    const activeParticipantAttrs = Object.entries(activeParticipant).reduce((o, [ k,v ]) => ({ ...o, [`data-${dasherize(k)}`]:v }), { })

    return <div>
      <h1>Chat App!</h1>
      <div id="remote-container">
        <p className="instructions">
          {this.state.participantId ? `You're connected with: ${this.state.participantId}` : null}
        </p>
        <div id="remote-media"></div>
      </div>
      <div id="controls">
        <div id="preview">
          <p className="instructions">Hello {activeParticipant.isJoin ? params.join : params.host}</p>
          <div id="local-media"></div>
          <button id="button-preview">Preview My Camera</button>
        </div>
        <div id="room-controls">
          <button id="button-join">Join Room</button>
          <button id="button-leave">Leave Room</button>
        </div>
        <div id="log"></div>
        <span id="active-participant" {...activeParticipantAttrs}></span>
      </div>
    </div>
  }
}
