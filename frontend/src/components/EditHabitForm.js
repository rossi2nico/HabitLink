import { useState } from "react"
import { useHabits } from "../hooks/useHabits"

export const EditHabitForm = (habit) => {
  
  const [isPopup, setIsPopup] = useState(false)
  const [name, setName] = useState(undefined)
  const [description, setDescription] = useState(undefined)
  const [frequency, setFrequency] = useState(7) // implement this later if needed
  const [privacy, setPrivacy] = useState(0)
  const { updateHabit, isLoading, error } = useHabits()

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    const success = await updateHabit(habit._id, name, description, frequency, privacy)
    if (!success) {
      return
    }
  
    setName('')
    setDescription('')
    setPrivacy(0)
    setIsPopup(false)
  }
  
  return (
    <div>
      <button className = 'create-habit-button' onClick={() => setIsPopup(true)} >
        Update Habit
      </button>

      { isPopup && (
        <div className = 'habit-popup'>
          <button className = 'close-popup' onClick = {() => setIsPopup(false)}>
            Cancel
          </button>
          <form className = 'create-habit-form' onSubmit = {handleSubmit}>
            <h3>Update Habit</h3>

            <label> Name: </label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />

            <label> Description: </label>
            <input
              type="text"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />

            {/* <label> Privacy: </label>
            <select value = {privacy} onChange = {(e) => setPrivacy(e.target.value)}>
              <option value = "private"> private </option>
              <option value = "friends"> friends only </option>
              <option value = "public"> public </option>
            </select> */}

            { /* <select value = {frequency} onChange = {(e) => setFrequency(e.target.value)} >
                <option value = "daily"> Daily </option>
                <option value = "weekly"> Weekly </option>
                <option value = 'custom'> TBD </option>
            </select> */ }

          <button> Add Habit </button>
          {error && <div className = "error"> {error} </div>}
          </form>
        </div>
      )}
    </div>
  )
}