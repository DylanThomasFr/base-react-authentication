import {Fragment} from "react";
import {useContext} from "react";
import { Link } from 'react-router-dom';

import classes from './MainNavigation.module.css';
import AuthContext from "../../store/AuthContext";

const MainNavigation = () => {
    const context = useContext(AuthContext)
    const logoutHandler = () => context.logout()
    return (
        <header className={classes.header}>
            <Link to='/'>
                <div className={classes.logo}>React Auth</div>
            </Link>
            <nav>
                <ul>
                    {
                        !context.isLoggedIn &&
                        <li>
                            <Link to='/auth'>Login</Link>
                        </li>
                    }
                    {
                        context.isLoggedIn && (
                            <Fragment>
                                <li>
                                    <Link to='/profile'>Profile</Link>
                                </li>
                                <li>
                                    <button onClick={logoutHandler}>Logout</button>
                                </li>
                            </Fragment>
                        )
                    }
                </ul>
            </nav>
        </header>
    );
};

export default MainNavigation;
