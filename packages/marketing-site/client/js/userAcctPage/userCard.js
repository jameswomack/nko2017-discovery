const UserCard = (props) => {
  return (
    <div className="card-container">
      <div className="user-card">
        <span className="username">{ props.username || '<username>' }</span>
        <img className="avatar" src={ props.avatar }/>
      </div>
    </div>
  )
}

export default UserCard
