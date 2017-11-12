'use strict'
// File is taken from the twilio video quickstart

module.exports = function () {
  const Video = window.Twilio.Video

  let activeRoom
  let previewTracks
  let identity
  let roomName

  // Attach the Tracks to the DOM.
  function attachTracks(tracks, container) {
    tracks.forEach((track) => {
      container.appendChild(track.attach())
    })
  }

  // Attach the Participant's Tracks to the DOM.
  function attachParticipantTracks(participant, container) {
    const tracks = Array.from(participant.tracks.values())
    attachTracks(tracks, container)
  }

  // Detach the Tracks from the DOM.
  function detachTracks(tracks) {
    tracks.forEach((track) => {
      track.detach().forEach((detachedElement) => {
        detachedElement.remove()
      })
    })
  }

  // Detach the Participant's Tracks from the DOM.
  function detachParticipantTracks(participant) {
    const tracks = Array.from(participant.tracks.values())
    detachTracks(tracks)
  }

  // When we are about to transition away from this page, disconnect
  // from the room, if joined.
  window.addEventListener('beforeunload', leaveRoomIfJoined)

  const activeParticipant = document.getElementById('active-participant').dataset

  // Obtain a token from the server in order to connect to the Room.
  // Get the room name for the host
  fetch('/token', {
    method: 'POST',
    body: JSON.stringify(activeParticipant),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  }).then(response =>
    response.json()
  ).then(data => {
    identity = data.identity
    document.getElementById('room-controls').style.display = 'block'

    // Bind button to join Room.
    document.getElementById('button-join').onclick = function() {
      roomName = data.roomName
      document.getElementById('room-name').value = roomName
      if (!roomName) {
        alert('Failed to create a room name.')
        return
      }

      log(`Joining room '${roomName}'...`)
      const connectOptions = {
        name: roomName,
        logLevel: 'debug'
      }

      if (previewTracks) 
        connectOptions.tracks = previewTracks
      

      // Join the Room with the token from the server and the
      // LocalParticipant's Tracks.
      Video.connect(data.token, connectOptions).then(roomJoined, (error) => {
        log(`Could not connect to Twilio: ${error.message}`)
      })
    }

    // Bind button to leave Room.
    document.getElementById('button-leave').onclick = function() {
      log('Leaving room...')
      activeRoom.disconnect()
    }
  })

  // Successfully connected!
  function roomJoined(room) {
    window.room = activeRoom = room

    log(`Joined as '${identity}'`)
    document.getElementById('button-join').style.display = 'none'
    document.getElementById('button-leave').style.display = 'inline'

    // Attach LocalParticipant's Tracks, if not already attached.
    const localPreviewContainer = document.getElementById('local-media')
    if (!localPreviewContainer.querySelector('video')) 
      attachParticipantTracks(room.localParticipant, localPreviewContainer)
    

    // Attach the Tracks of the Room's Participants.
    room.participants.forEach((participant) => {
      log(`Already in Room: '${participant.identity}'`)
      const previewContainer = document.getElementById('remote-media')
      attachParticipantTracks(participant, previewContainer)
    })

    // When a Participant joins the Room, log the event.
    room.on('participantConnected', (participant) => {
      log(`Joining: '${participant.identity}'`)
      const event = new CustomEvent('participantConnected', { detail: participant.identity })
      document.dispatchEvent(event)
    })

    // When a Participant adds a Track, attach it to the DOM.
    room.on('trackAdded', (track, participant) => {
      log(`${participant.identity} added track: ${track.kind}`)
      const previewContainer = document.getElementById('remote-media')
      attachTracks([track], previewContainer)
    })

    // When a Participant removes a Track, detach it from the DOM.
    room.on('trackRemoved', (track, participant) => {
      log(`${participant.identity} removed track: ${track.kind}`)
      detachTracks([track])
    })

    // When a Participant leaves the Room, detach its Tracks.
    room.on('participantDisconnected', (participant) => {
      log(`Participant '${participant.identity}' left the room`)
      detachParticipantTracks(participant)
    })

    // Once the LocalParticipant leaves the room, detach the Tracks
    // of all Participants, including that of the LocalParticipant.
    room.on('disconnected', () => {
      log('Left')
      if (previewTracks) 
        previewTracks.forEach((track) => {
          track.stop()
        })
      
      detachParticipantTracks(room.localParticipant)
      room.participants.forEach(detachParticipantTracks)
      activeRoom = null
      document.getElementById('button-join').style.display = 'inline'
      document.getElementById('button-leave').style.display = 'none'
    })
  }

  // Preview LocalParticipant's Tracks.
  document.getElementById('button-preview').onclick = function() {
    const localTracksPromise = previewTracks
      ? Promise.resolve(previewTracks)
      : Video.createLocalTracks()

    localTracksPromise.then((tracks) => {
      window.previewTracks = previewTracks = tracks
      const previewContainer = document.getElementById('local-media')
      if (!previewContainer.querySelector('video')) 
        attachTracks(tracks, previewContainer)
      
    }).catch((error) => {
      console.error('Unable to access local media', error)
      log('Unable to access Camera and Microphone')
    })
  }

  // Activity log.
  function log(message) {
    const logDiv = document.getElementById('log')
    logDiv.innerHTML += `<p>&gt;&nbsp;${message}</p>`
    logDiv.scrollTop = logDiv.scrollHeight
  }

  // Leave Room.
  function leaveRoomIfJoined() {
    if (activeRoom) 
      activeRoom.disconnect()
  }
}
