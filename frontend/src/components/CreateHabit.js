import { useState } from "react"
import { useHabits } from "../hooks/useHabits"
import { Navigation } from "./Navigation"
import { useNavigate } from "react-router-dom"

export const CreateHabit = () => {
  
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [privacy, setPrivacy] = useState(0)
  const [localError, setLocalError] = useState('')
  const { createHabit, isLoading, error } = useHabits()
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const res = await createHabit(name, description, 7, privacy)
    if (!res.success) {
      setLocalError(res.error)
      return
    }
  
    setName('')
    setDescription('')
    setPrivacy(0)
    navigate('/habits');
  }
  
  return (
    <div style = {{display:'flex', flexDirection:'column', alignItems:'center'}}>
      <Navigation></Navigation>
    <div style = {{marginTop:'50px'}}className = "create-habit">
      <div className="create-habit-form-container">
        <h4 style={{fontWeight: 500, color: '#eeeeeeff'}}> The best time to plant a tree was 20 years ago. The next best time is now.</h4>

        <form className="create-habit-form" onSubmit={handleSubmit}>

          {/* <label>Name:</label> */}
          <input
            style={{marginTop: '15px'}}
            type="text"
            placeholder="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />

          <input
            type="text"
            placeholder="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />

          {/* <label>Privacy:</label> */}
          <select
            onChange={(e) => setPrivacy(parseInt(e.target.value))}
            value={privacy}
          >
            <option value={0}>Private</option>
            <option value={1}>Friends</option>
            <option value={2}>Public</option>
          </select>
          <div style = {{marginTop:'10px', marginBottom:'0px', width:'230px'}} className="underline"></div>

          <button  className = "submit-habit" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Habit'}
          </button>
          
          {(localError || error) && (
            <div className="error">{localError || error}</div>
          )}
          <button type = "button" className = "cancel" onClick = {() => {navigate('/habits');}}>
            cancel
          </button>
        </form>
      </div>
    </div>
   </div>
  );
}