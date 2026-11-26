import { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const LoginPopup = ({ setShowLogin }) => {

    const { setToken, url,loadCartData } = useContext(StoreContext)
    const [currState, setCurrState] = useState("Sign Up");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (e) => {
        e.preventDefault()
        if (isSubmitting) return

        let new_url = url;
        if (currState === "Login") {
            new_url += "/api/user/login";
        }
        else {
            new_url += "/api/user/register"
        }

        setIsSubmitting(true)
        try {
            const response = await axios.post(new_url, data);
            if (response.data.success) {
                setToken(response.data.token)
                localStorage.setItem("token", response.data.token)
                loadCartData(response.data.token)
                setShowLogin(false)
            }
            else {
                toast.error(response.data.message || "Unable to create your account. Please try again.")
            }
        } catch {
            toast.error("Unable to reach the server. Please try again later.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2> <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" ? <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required /> : <></>}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                </div>
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Please wait..." : currState === "Login" ? "Login" : "Create account"}</button>
                <label className="login-popup-condition">
                    <input type="checkbox" required/>
                    <p>By continuing, i agree to the terms of use & privacy policy.</p>
                </label>
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
                }
            </form>
        </div>
    )
}

export default LoginPopup
