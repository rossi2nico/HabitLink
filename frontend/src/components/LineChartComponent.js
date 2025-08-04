'use-client';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts';

export const LineChartComponent = () => {

const habitStats = [
  { date: 'Jul 1',  Karim: 20, Allison: 0, Dylan: 35 },
  { date: 'Jul 2',  Karim: 40, Allison: 15, Dylan: 50 },
  { date: 'Jul 3',  Karim: 15, Allison: 20, Dylan: 68 },
  { date: 'Jul 4',  Karim: 20, Allison: 25, Dylan: 92 },
  { date: 'Jul 5',  Karim: 15, Allison: 20, Dylan: 91 },
  { date: 'Jul 6',  Karim: 30, Allison: 40, Dylan: 79 },
  { date: 'Jul 7',  Karim: 20, Allison: 55, Dylan: 90 },

  { date: 'Jul 8',  Karim: 28, Allison: 35, Dylan: 94 },
  { date: 'Jul 9',  Karim: 42, Allison: 65, Dylan: 93 },
  { date: 'Jul 10', Karim: 28, Allison: 55, Dylan: 88 },
  { date: 'Jul 11', Karim: 22, Allison: 75, Dylan: 90 },
  { date: 'Jul 12', Karim: 0, Allison: 70, Dylan: 92 },
  { date: 'Jul 13', Karim: 5, Allison: 75, Dylan: 95 },
  { date: 'Jul 14', Karim: 10, Allison: 60, Dylan: 91 },
];


  return (
    <ResponsiveContainer width = "100%" height = "75%">
      <LineChart data={habitStats} width={600} height={200}>
        <XAxis dataKey="date" stroke="transparent" tick={{ fill: "#fff" }} />
        <YAxis stroke="transparent" tick={{ fill: "#fff" }} tickFormatter={(v) => `${v}%`} />
        <Tooltip />
        <Legend />
        <defs>
          <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#638dffff" />
          <stop offset="100%" stopColor="#a5fade" />
          </linearGradient>
        </defs>
        <Line type="monotone" dataKey="Karim" name="Edin" strokeWidth={3} stroke="#2563eb" dot={false} activeDot={false} />
        <Line type="monotone" dataKey="Allison" name="Doolie" strokeWidth={3} stroke = "url(#gradient1)" dot={false} activeDot={false} />
        <Line type="monotone" dataKey="Dylan" name="Nico" strokeWidth={3} stroke="#7c3aed" dot={false} activeDot={false} />
      </LineChart>
      
    {/* <LineChart width = {300} height = {400} data = {habitStats}>
      <YAxis
        dataKey="completionPercentage"
        domain={[0, 100]}
        tickFormatter={(value) => `${value}%`}
        stroke="#ffffff" 
        tick={{ fill: "#ffffff" }} 
      />
      <XAxis 
        dataKey="date"
        stroke="#ffffff"
        tick={{ fill: "#ffffff" }}
      />
      <Legend/>
      <defs>
        <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ebf9ff" />
        <stop offset="100%" stopColor="#a5fade" />
        </linearGradient>
      </defs>

        <Line 
          type = "monotone" 
          dataKey = "completionPercentage"
          stroke = "url(#gradient1)"
          strokeWidth={4}
          fill = "#1c64ffff"
          dot={false}
          activeDot={false}
        />
      </LineChart> */}
    </ResponsiveContainer>
  )
}