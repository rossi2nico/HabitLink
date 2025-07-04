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
    <>
      <Navigation></Navigation>
      <form className = "login" onSubmit = {handleSubmit}>
        <h3>Sign up</h3>

        <label>Username:</label>
        <input
            type = "username"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
            value = { username }
        />
        
        <label>Password:</label>
        <input
            type = "password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value = { password }
        />

        <button type="submit" disabled ={ isLoading }> submit</button>
        {error && <div className='error'>{error}</div>}
          </form>
        <h3 style = {{marginTop: '-45px'}}><Link to="/login">already have an account? login here</Link></h3>
      </>
  )
}
export default Signup