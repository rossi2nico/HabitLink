import { useState } from 'react'
import { useLogin } from '../hooks/useLogin'
import '../index.css';
import { Navigation } from '../components/Navigation';
import { Link } from 'react-router-dom';

const Login = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [forgotText, setForgotText] = useState("forgot your password?")

    const { login, error, isLoading } = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await login(username, password)
    }

    return (
        <div className = "login-page">
            <Navigation></Navigation>
            <form className = "login" onSubmit = {handleSubmit}>
                <h3>Log in to HabitLink</h3>
                <input
                    type = "username"
                    name="username"
                    placeholder='username'
                    onChange={(e) => setUsername(e.target.value)}
                    value = {username}
                />
                <input
                    type = "password"
                    name="password"
                    placeholder='password'
                    onChange={(e) => setPassword(e.target.value)}
                    value = {password}
                />
                <p onClick={() => { setForgotText("that sucks :(") }} style={{ fontFamily: "Manrope", fontWeight: "600", marginTop: "-15px", marginBottom: "0px", marginRight: "-120px", border: "none", color:"#bdbdbdff", background:"transparent", height:"20px", width:"150px", fontSize:"13px", textAlign:"right", cursor:"pointer"}}>{forgotText}</p>
                <button type="submit" disabled={isLoading}>Log in</button>
                {error && <div className="error">{error}</div>}
                <p style = {{fontSize:"15px", color:"#bdbdbdff"}}>Don't have an account? <Link style = {{color:"white", textDecoration:"none", fontSize: "15px"}} to="/signup"><strong>Sign up</strong></Link></p>

            </form>
        </div>
    )
}

export default Login