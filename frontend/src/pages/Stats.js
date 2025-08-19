import { Navigation } from "../components/Navigation"
import { AdvancedHabit } from "../components/AdvancedHabit"
import { useState, useEffect } from "react"

const Stats = (habit) => {
  
  const [activeHabit, setActiveHabit] = useState(habit)
  


  return (
    <div className = "stats-page">
      <Navigation></Navigation>     
      <AdvancedHabit habit = {habit}></AdvancedHabit>
    </div>
  )
}

export default Stats
