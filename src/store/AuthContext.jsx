import {createContext, useState, useEffect} from "react"

let logoutTimer

const AuthContext = createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {}
})

const calculatingRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime()
    const adjustedExpirationTime = new Date(expirationTime).getTime()

    return adjustedExpirationTime - currentTime
}

const retrieveToken = () => {
    const initialToken = localStorage.getItem('token')
    const storedExpirationDate = localStorage.getItem('expiresIn')

    const remainingTime = calculatingRemainingTime(storedExpirationDate)

    if(remainingTime <= 3600) {
        localStorage.removeItem('token')
        localStorage.removeItem('expiresIn')
        return null
    }
    return {
        token: initialToken,
        expiresIn: remainingTime
    }
}

export const AuthContextProvider = (props) => {
    const tokenData = retrieveToken()
    let initialToken
    if(tokenData) {
        initialToken = tokenData.token
    }
    const [token, setToken] = useState(initialToken)

    const userIsLoggedIn = !!token

    const logoutHandler = () => {
        localStorage.removeItem('token')
        setToken(null)

        if(logoutTimer) {
            clearTimeout(logoutTimer)
        }
    }

    const loginHandler = (token, expirationTime) => {
        setToken(token)
        localStorage.setItem('token', token)
        localStorage.setItem('expiresIn', expirationTime)

        const remainingTime = calculatingRemainingTime(expirationTime)
        logoutTimer = setTimeout(logoutHandler, remainingTime)
    }

    useEffect(() => {
        if(tokenData) {
            logoutTimer = setTimeout(logoutHandler, tokenData.expiresIn)
        }
    }, [tokenData, logoutHandler])

    const contextValue = {
        token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
}

export default AuthContext