import { useState } from 'react'
import { useLogin } from '../hooks/useLogin'
import '../index.css';

const Login = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login, error, isLoading } = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await login(username, password)
    }

    return (
        <form className = "login" onSubmit = {handleSubmit}>
            <h3>Login</h3>

            <label>Username:</label>
            <input
                type = "username"
                name="username"
                onChange={(e) => setUsername(e.target.value)}
                value = {username}
            />
            <label>Password:</label>
            <input
                type = "password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value = {password}
            />
            
            <button type="submit" disabled={isLoading}>Log in</button>
            {error && <div className="error">{error}</div>}
        
        </form>
    )
}

export default Login