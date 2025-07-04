import { useState } from 'react'
import { useLogin } from '../hooks/useLogin'
import '../index.css';
import { Navigation } from '../components/Navigation';
import { Link } from 'react-router-dom';

const Login = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login, error, isLoading } = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await login(username, password)
    }

    return (
        <>
            <Navigation></Navigation>
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
            <h3 style={{ marginTop: "-45px" }}>
                <Link to="/signup">Don't have an account? Register here</Link>
            </h3>
        </>
    )
}

export default Login