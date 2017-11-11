import ReactDOM from 'react-dom'

const App = () => {
  return <div>
    <h1>Chat App!</h1>
    <div id="remote-media"></div>
    <div id="controls">
      <div id="preview">
        <p className="instructions">Hello Beautiful</p>
        <div id="local-media"></div>
        <button id="button-preview">Preview My Camera</button>
      </div>
      <div id="room-controls">
        <p className="instructions">Room Name:</p>
        <input id="room-name" type="text" placeholder="Enter a room name" />
        <button id="button-join">Join Room</button>
        <button id="button-leave">Leave Room</button>
      </div>
      <div id="log"></div>
    </div>
  </div>
}

ReactDOM.render(<App />, document.getElementById('root'))
