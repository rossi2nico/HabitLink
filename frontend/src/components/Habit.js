import { useHabits } from '../hooks/useHabits'
import { useAuthContext } from '../hooks/useAuthContext';

export const Habit = ({ habit }) => {

  const { toggleComplete } = useHabits();
  const { user } = useAuthContext();

  const isUsersHabit = () => {
    return user?._id?.toString() === habit?.userId?.toString();
}

  const syncedUsers = habit.syncedHabits.map(
    syncedHabit => syncedHabit.userId); 
 
  const sameDate = (d1, d2) => {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        )
    }

  const isComplete = () => {
    const today = new Date();
    const len = habit.completions.length;
    if (len === 0) {
      return false;
    }
    const lastDate = new Date(habit.completions[len - 1]);
    return sameDate(today, lastDate);
  }

  const complete = isComplete();
  const usersHabit = isUsersHabit();

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
        
        {usersHabit &&
          <button onClick = { () => toggleComplete(habit._id) }>
            {complete ? (
              <p style={{ margin: "0px" }}>Mark as incomplete</p>
            ) : (
              <p style={{ margin: "0px" }}>Mark as complete</p>
            )}
          </button>
        } 
      </div>
    </div>
  )
}