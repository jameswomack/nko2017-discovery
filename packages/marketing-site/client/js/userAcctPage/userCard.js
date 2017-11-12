export default (props) => {
  return (
    <div className="user-card">
      <span>{ props.username }</span>
      <img src={ props.userpic }/>
    </div>
  )
}
