import unsync from '../assets/unsync2.png'

export const UserCard = ( { habit } ) => {

  const rawPercentCompleted = habit.habitId.totalCompletions / habit.habitId.potentialCompletions * 100;
  const percentCompleted = parseFloat(rawPercentCompleted.toFixed(1)); 

  return (
    <div className = "synced-user">
      <div className = "synced-user-left">
        <h4>{ habit.username.charAt(0).toUpperCase() + habit.username.slice(1) }</h4>
        <p> 🔥 { habit.habitId.streak } 🏹 { habit.habitId.maxStreak } 🚀 { percentCompleted }%</p>
      </div>
      <div className = "synced-user-right">
        <img style = {{marginLeft: '15px', marginTop:'5px', width:'30px'}}src = { unsync }></img>
      </div>
      
    </div>
  )
}