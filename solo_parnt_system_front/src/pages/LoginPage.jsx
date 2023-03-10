import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAthenticationContext } from "../components/Authentication";
import logo from "../cssd_logo.png"

const LoginPage = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [invalid, setInvalid] = useState(false);

    const { user } = useAthenticationContext();

    let from = location.state ? location.state.from || "/" : "/";

    let { logout } = location.state || {};

    useEffect(() => {
        if(!logout && localStorage.getItem('auth_token'))
            navigate(from, { replace: true });
    }, [user, localStorage]);

    const __login__ = (e) => {
        e.preventDefault();
        
        setInvalid(false);
        axios.post('http://localhost:8000/auth/token/login/', {
            username,
            password,
        }).then((resp) => {
            let authToken = resp.data.auth_token;

            localStorage.setItem('auth_token', authToken);

            navigate(from, {
                replace: true,
            });

            setInvalid(false);
        }).catch((err) => {
            setInvalid(true);
        });
    }

    return (
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="mt-16 flex flex-col items-center">
                    <img className="w-64" src={logo} />
                    <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
                </div>
                <form className="mt-8 space-y-6"
                    onSubmit={__login__}
                >
                    <input type="hidden" name="remember" value="true" />
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Username</label>
                            <input id="email-address" name="email" type="text" required className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input id="password" name="password" type="password" required className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {invalid && (
                        <div className="w-full">
                            <p className="text-center text-red-500">Invalid Username or Password</p>
                        </div>
                    )}


                    <div>
                        <button type="submit" className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">

                                <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                                </svg>
                            </span>
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;