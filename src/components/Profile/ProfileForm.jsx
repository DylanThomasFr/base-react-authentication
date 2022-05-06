import classes from './ProfileForm.module.css';
import {useContext, useRef} from "react";
import { useNavigate } from "react-router-dom"
import AuthContext from "../../store/AuthContext";

const ProfileForm = () => {
    const passwordInputRef = useRef()
    const context = useContext(AuthContext);
    const navigate = useNavigate()

    const submitHandler = async (event) => {
        event.preventDefault()

        const enteredPassword = passwordInputRef.current.value

        try {
            await fetch(
                `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.VITE_APP_FIREBASE_API_KEY}`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        idToken: context.token,
                        password: enteredPassword,
                        returnSecureToken: false
                    }),
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
            )
            navigate('/', { replace: true })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <form onSubmit={submitHandler} className={classes.form}>
            <div className={classes.control}>
                <label htmlFor='new-password'>New Password</label>
                <input ref={passwordInputRef} minLength="6" type='password' id='new-password' />
            </div>
            <div className={classes.action}>
                <button>Change Password</button>
            </div>
        </form>
    );
}

export default ProfileForm;
