import { useState, useRef, useContext } from 'react';
import { useNavigate } from "react-router-dom"

import classes from './AuthForm.module.css';
import AuthContext from "../../store/AuthContext";

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const emailInputRef = useRef()
    const passwordInputRef = useRef()
    const context = useContext(AuthContext);
    const navigate = useNavigate()

    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    };

    const sendRequest = async (url, email, password) => {
        const response = await fetch(
            url,
            {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken: true
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            }
        )

        if(response.ok) {
            return response.json()
        }
        throw new Error('Authentication failed !')
    }

    const submitHandler = async (event) => {
        event.preventDefault()

        const enteredEmail = emailInputRef.current.value
        const enteredPassword = passwordInputRef.current.value

        const url = `https://identitytoolkit.googleapis.com/v1/accounts:${isLogin ? 'signInWithPassword' : 'signUp'}?key=${process.env.VITE_APP_FIREBASE_API_KEY}`

        try {
            const data = await sendRequest(url, enteredEmail, enteredPassword)
            const expirationTime = new Date( ( new Date().getTime() + (+data.expiresIn * 1000) ) )
            context.login(data.idToken, expirationTime)
            navigate('/', { replace: true })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <section className={classes.auth}>
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <form onSubmit={submitHandler}>
                <div className={classes.control}>
                    <label htmlFor='email'>Your Email</label>
                    <input ref={emailInputRef} type='email' id='email' required />
                </div>
                <div className={classes.control}>
                    <label htmlFor='password'>Your Password</label>
                    <input ref={passwordInputRef} type='password' id='password' required />
                </div>
                <div className={classes.actions}>
                    <button>{isLogin ? 'Login' : 'Create Account'}</button>
                    <button
                        type='button'
                        className={classes.toggle}
                        onClick={switchAuthModeHandler}
                    >
                        {isLogin ? 'Create new account' : 'Login with existing account'}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default AuthForm;
