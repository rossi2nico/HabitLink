

export const Habit = ({ habit }) => {

  const syncedUsers = habit.syncedHabits.map(
    syncedHabit => syncedHabit.userId); 
 
  return (
    <div className = "habit">
      <p>{habit.name}</p>
      {/* <p>frequency: {habit.frequency}</p>
      <p>streak: {habit.streak} </p> */}
      <p>Synced with users: {syncedUsers.join(", ")}</p>

              
    </div>
  )
}