import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from "react-router-dom";

const authenticationContext = createContext();

export const useAthenticationContext = () => {
    return useContext(authenticationContext);
}

export const AuthenticationProvider = ({ children }) => {
    const [user, setUser] = useState({
        is_admin: false,
    });

    const logout = () => {
        axios.post('http://localhost:8000/auth/token/logout/', {
            headers: {
                Authorization: `Token ${localStorage.getItem('auth_token')}`,
            }
        }).then((resp) => {
            localStorage.removeItem('auth_token');
            setUser({});
        }).catch((err) => {
            localStorage.removeItem('auth_token');
            setUser({});
        });
    }

    return (
        <authenticationContext.Provider
            value={{
                user,
                setUser,
                logout,
            }}
        >
            { children }
        </authenticationContext.Provider>
    );
}

export const RequireAuth = ({ children }) => {


    const navigate = useNavigate();
    const location = useLocation();

    const {
        user,
        setUser,
    } = useAthenticationContext();

    useEffect(() => {
        if(!localStorage.getItem('auth_token'))
            navigate('/login/', { replace: true, state: { from: location.pathname } });

        if(!user.id)
            __load_user__();

    }, [location]);

    const __load_user__ = () => {
        axios.get('http://localhost:8000/auth/users/me/', {
            headers: {
                Authorization: `Token ${localStorage.getItem('auth_token')}`
            }
        }).then((resp) => {
            setUser({...resp.data});
        }).catch(() => {
            localStorage.removeItem('auth_token');
            navigate('/login/', { replace: true, state: { from: location.pathname } });
        });
    }

    return children;
}