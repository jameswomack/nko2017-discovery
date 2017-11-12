const GetBadgeLink = (props) => {
  return (
    <input
      className="get-badge-link"
      type="text"
      value={ props.badgeLink || 'Ye be no maintainer!' }
    />
  )
}

export default GetBadgeLink
