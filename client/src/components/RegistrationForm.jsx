import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "..";
import ActivationNeeded from "./ActivationNeeded";
import '../styles/auth.scss';
import Button from "./Button";

const RegistrationForm = () => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const {authState} = useContext(Context)
    const location = useLocation()
    const navigate = useNavigate()
    const [mailSent, setMailSent] = useState(false)

    const fromPage = location.state?.from?.pathname || '/draw'

    useEffect(() => {
        if (authState.isAuth === true) {
           navigate(fromPage, {replace: true})
        }
    }, [])

    const registrationHandle = async(event) => {
        event.preventDefault()
        await authState.registration(email, username, password)
        if(!authState.authFail) {
            setMailSent(true)
        }
    }

    return (
        <div>
            {mailSent 
            ?
                <ActivationNeeded/>
            :
            <div className="login-page">
                <div className="login-window"> 
                    <div className="left-img"></div>
                    <form autoComplete="off" onSubmit={registrationHandle}> 
                        <h4>LiveCanvas</h4>
                        <p>Register your account and start drawing with frends!</p>
                        <div className="floating-label">
                            <input
                                className="input-auth"
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                                type="email"
                                placeholder='Email'
                            />
                                <label htmlFor="email">Email:</label>
                                <div className="icon">
                                    <svg enableBackground="new 0 0 100 100" version="1.1" viewBox="0 0 100 100"  xmlns="http://www.w3.org/2000/svg">
                                    <style type="text/css">
                                    {`.st0 {
                                        fill: none;
                                    }`}
                                    </style>
                                    <g transform="translate(0 -952.36)">
                                        <path d="m17.5 977c-1.3 0-2.4 1.1-2.4 2.4v45.9c0 1.3 1.1 2.4 2.4 2.4h64.9c1.3 0 2.4-1.1 2.4-2.4v-45.9c0-1.3-1.1-2.4-2.4-2.4h-64.9zm2.4 4.8h60.2v1.2l-30.1 22-30.1-22v-1.2zm0 7l28.7 21c0.8 0.6 2 0.6 2.8 0l28.7-21v34.1h-60.2v-34.1z"/>
                                    </g>
                                    <rect className="st0" width="100" height="100"/>
                                    </svg>
                                 </div>

                        </div>
                        <div className="floating-label">
                            <input
                                className="input-auth"
                                onChange={e => setUsername(e.target.value)}
                                value={username}
                                type="text"
                                placeholder='username'
                            />
                            <label htmlFor="username">Username:</label>
                            <div className="icon">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </div>
                        </div>
                        <div className="floating-label">
                            <input
                                className="input-auth"
                                onChange={e => setPassword(e.target.value)}
                                value={password}
                                type="password" 
                                placeholder='Password'
                            />
                            <label htmlFor="password">Password:</label>
                            <div className="icon">     
                                        <svg enableBackground="new 0 0 24 24" version="1.1" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
                                <style type="text/css">
                                        {`
                                            .st0 {
                                            fill: none;
                                            }
                                            .st1 {
                                            fill: #010101;
                                            }
                                        `}
                                </style>
                                        <rect className="st0" width="24" height="24"/>
                                        <path className="st1" d="M19,21H5V9h14V21z M6,20h12V10H6V20z"/>
                                        <path className="st1" d="M16.5,10h-1V7c0-1.9-1.6-3.5-3.5-3.5S8.5,5.1,8.5,7v3h-1V7c0-2.5,2-4.5,4.5-4.5s4.5,2,4.5,4.5V10z"/>
                                        <path className="st1" d="m12 16.5c-0.8 0-1.5-0.7-1.5-1.5s0.7-1.5 1.5-1.5 1.5 0.7 1.5 1.5-0.7 1.5-1.5 1.5zm0-2c-0.3 0-0.5 0.2-0.5 0.5s0.2 0.5 0.5 0.5 0.5-0.2 0.5-0.5-0.2-0.5-0.5-0.5z"/>
                                </svg>
                            </div>
                        </div>
                        <Button type="submit">Create account</Button>
                        <Link to="/login" className="link">Log in</Link>
                        </form>
                </div>
            </div>
            }

        </div>
    )
}

export default RegistrationForm;

