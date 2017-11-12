const Splash = () => {
  return (
    <div className="splash-page">
      <div className="splash">
        <h1 className="splash-heading">
          Office Hours
        </h1>
        <p className="splash-blurb">
          Connect live<br/>
          face-to-face<br/>
          with the developers<br/>
          that make the open-source software<br/>
          that you depend on
        </p>
      </div>
      <div className="splash-list">
        <ul>
          <hr className="splash-list-separator"/>
          <li className="splash-bullet">
            <h3>Get help straight from the experts</h3>
          </li>
          <hr className="splash-list-separator"/>
          <li className="splash-bullet">
            <h3>Support open-source projects</h3>
          </li>
          <hr className="splash-list-separator"/>
        </ul>
        <button className="primary-button go-button">Sign Me Up!</button>
      </div>
    </div>
  )
}

export default Splash
