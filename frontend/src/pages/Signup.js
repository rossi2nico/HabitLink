import { useState } from "react"
import { useSignup } from "../hooks/useSignup"
import { Navigation } from "../components/Navigation"
import { Link } from "react-router-dom"

const Signup = () => {
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { signup, isLoading, error } = useSignup()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signup(username, password)
  }

  return (
    <div className = "login-page">
      <Navigation></Navigation>
      <form className = "login" onSubmit = {handleSubmit}>
        <h3>Sign up for HabitLink</h3>
        <input
            type = "username"
            name="username"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
            value = { username }
        />
                <input
            type = "password"
            name="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            value = { password }
        />
        <button style = {{fontSize:"14px", fontWeight:"700", fontFamily:"Manrope"}}type="submit" disabled ={ isLoading }>Sign up</button>
        {error && <div className ='error' style = {{textAlign:"center"}}>{error}</div>}
        <p style={{ marginTop: "5px", fontSize: "15px", color:"#bdbdbdff"}}>Already have an account? <Link style = {{color:"white", textDecoration:"none", fontSize: "15px"}} to="/login"><strong>Sign in</strong></Link></p>

      </form>
        
    </div>
  )
}
export default Signup