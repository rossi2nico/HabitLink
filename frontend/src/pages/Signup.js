import { useState } from "react"
import { useSignup } from "../hooks/useSignup"

const Signup = () => {
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { signup, isLoading, error } = useSignup()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signup(username, password)
  }

  return (
    <form className = "signup" onSubmit = {handleSubmit}>
      <h3>Sign up</h3>

      <label>username:</label>
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
  )
}
export default Signup