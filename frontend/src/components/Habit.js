

export const Habit = ({ habit }) => {

  const syncedUsers = habit.syncedHabits.map(
    syncedHabit => syncedHabit.userId); 
 
  return (
    <div className = "habit">
      <div className = "left">
        <h3>{habit.name}</h3>
        {/* <p>frequency: {habit.frequency}</p>
        <p>streak: {habit.streak} </p> */}
        
        <p className = "habit-id"> ID: {habit._id} </p>

        {habit.privacy === 2 ? (
          <p className = "privacy"> Public </p>
        ) : habit.privacy === 1 ? (
          <p className = "privacy"> Friends </p>
        ) : (
          <p className = "privacy"> Private </p>
        )}

        {habit.frequency === 7 ? (
          <p> Daily </p>
        ) : habit.frequency === 1 ? (
          <p> Weekly </p>
        ) : (
          <p> Custom frequency </p>
        )}

           
      </div>
      <div className = "right">
        {syncedUsers.length > 0 ? (
          <>
            <p style = {{ marginBottom: "-10px" }}> Synced Users: </p>
            <p style = {{ fontSize: "12px" }}> {syncedUsers.join(", ")} </p>
          </>
        ) : ( 
          <p> No synced users </p>
        )}  
      </div>
    </div>
  )
}