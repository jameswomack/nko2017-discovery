import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import VideoChat from './VideoChat'

const App = () => {
  return <Router basename='/chat'>
    <div>
      <Route path="/host/:host" component={VideoChat} />
      <Route path="/join/:host/:join" component={VideoChat} />
    </div>
  </Router>
}

ReactDOM.render(<App />, document.getElementById('root'))
