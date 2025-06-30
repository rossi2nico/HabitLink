import { useState } from "react"
import { useHabits } from "../hooks/useHabits"

export const CreateHabitForm = () => {
  
  const [isPopup, setIsPopup] = useState(false)
  const [name, setName] = useState(undefined)
  const [description, setDescription] = useState(undefined)
  const [frequency, setFrequency] = useState(7) // implement this later if needed
  const [privacy, setPrivacy] = useState(0)
  const { createHabit, deleteHabit, syncHabit, completeHabit, isLoading, error } = useHabits()

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    const success = await createHabit(name, description, frequency, privacy)
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
    <button
      className="create-habit-button"
      onClick={() => setIsPopup(true)}
    >
      New Habit
    </button>

    {isPopup && (
      <>
        <div
          className="popup-overlay"
          onClick={() => setIsPopup(false)}
        />
        <div className="habit-popup">
          <button
            className="close-popup"
            onClick={() => setIsPopup(false)}
          >
            Cancel
          </button>
          <form
            className="create-habit-form"
            onSubmit={handleSubmit}
          >
            <h3>Create New Habit</h3>

            <label>Name:</label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />

            <label>Description:</label>
            <input
              type="text"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />

            <button>Add Habit</button>
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </>
    )}
  </div>
);
}
