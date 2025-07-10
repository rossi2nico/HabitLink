
export const PendingUser = ({ incomingUser }) => {

  return (
    <div className = "pending-user-card">
      <p>{incomingUser.username}</p>
      <button>accept</button>
      <button>decline</button>
    </div>
  )
}