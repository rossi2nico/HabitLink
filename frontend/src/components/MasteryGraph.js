import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts';
import { useState, useEffect } from "react"
import { useHabits } from "../hooks/useHabits"
import { useAuthContext } from "../hooks/useAuthContext"
import { format, addDays } from 'date-fns'

export const MasteryGraph = ({ habit }) => {

  const { user } = useAuthContext();
  const { getLinkedHabits } = useHabits()
  const [linkedHabits, setlinkedHabits] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || !habit) return;

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await getLinkedHabits(habit._id)
        if (res.success === false) setError(res.error)
        else setlinkedHabits(res.linkedHabits)
      } catch (error) {
        console.error({ error: error.message })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [user])

  const currentDate = new Date()
  currentDate.setHours(0, 0, 0 , 0)
    
  const masteryData = []
  const startDate = habit.startDate
  let checkDate = new Date(startDate + "T00:00:00") // Forces local timezone
  let mastery = 0, gain = 0, decay = 0

  while (checkDate <= currentDate) {
    // add half of maxStreak at the end or something.
    const dateString = format(checkDate, 'yyyy-MM-dd')
    if (dateString in habit.completions) {
      gain += 0.5
      decay = Math.max(decay / 2, 0);
      mastery += 1 + (gain / 5);
    } else {
      gain = Math.max((gain - 2) / 2, 0);
      decay += 1
      mastery = Math.max(0, mastery - 1 - decay)
    }

    masteryData.push({ date: dateString, mastery: mastery });
    // Need to convert to UTC, add one day, then convert back to string
    checkDate = addDays(checkDate, 1)
  }

  return (
    <ResponsiveContainer width = "100%" height = "85%">
      <LineChart data = { masteryData }>
        <XAxis
          dataKey="date"
          stroke="transparent"
          tick={{ fill: "#666", fontSize: 13, dy: 10 }}
          ticks = {[startDate, format(currentDate, 'yyyy-MM-dd')]}
        />
        <YAxis
          domain = {[0, 50]}
          stroke="transparent"
          tick={{ fill: "#666", fontSize: 12, dx: -20 }}
        />

        <defs>
          <linearGradient id="GradientColor2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff1e00ff" stopOpacity={1} />
            <stop offset="100%" stopColor="#e00056ff" stopOpacity={1} />
          </linearGradient>
        </defs>

        <Line
          type="monotone"
          dataKey = "mastery"
          name = "mastery"
          strokeLinecap="round"
          strokeWidth={4}
          stroke="url(#GradientColor2)"
          animationDuration={3500}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
)}