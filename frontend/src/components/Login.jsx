import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

function Login({ onLogin }) {
    const [isSignup, setIsSignup] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/login/",
                {
                    username: username,
                    password: password
                }
            );

            localStorage.setItem("token", response.data.token);

            onLogin();

        } catch (error) {
            setMessage("Invalid username or password.");
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setMessage("");

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        if (!username.trim() || !password.trim()) {
            setMessage("Please enter a username and password.");
            return;
        }

        try {
            await axios.post(
                "http://127.0.0.1:8000/api/register/",
                {
                    username: username,
                    password: password
                }
            );

            setMessage("Account created successfully! Please sign in.");

            setIsSignup(false);
            setPassword("");
            setConfirmPassword("");

        } catch (error) {
            if (error.response?.data?.username) {
                setMessage(error.response.data.username[0]);
            } else {
                setMessage("Unable to create account.");
            }
        }
    };

    const switchMode = () => {
        setIsSignup(!isSignup);

        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setMessage("");
    };

    return (
        <div className="login-page">

            <div className="login-box">

                <h1>WATCHNEXT</h1>

                <p className="login-subtitle">
                    YOUR MOVIE UNIVERSE
                </p>

                {isSignup ? (
                    <>
                        <h2>Create Account</h2>

                        <form onSubmit={handleSignup}>

                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />

                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />

                            <button type="submit">
                                Create Account
                            </button>

                        </form>

                        <p className="auth-switch">
                            Already have an account?
                            <button
                                type="button"
                                onClick={switchMode}
                            >
                                Sign In
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <h2>Sign In</h2>

                        <form onSubmit={handleLogin}>

                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />

                            <button type="submit">
                                Sign In
                            </button>

                        </form>

                        <p className="auth-switch">
                            New to WatchNext?
                            <button
                                type="button"
                                onClick={switchMode}
                            >
                                Create Account
                            </button>
                        </p>
                    </>
                )}

                {message && (
                    <p className="auth-message">
                        {message}
                    </p>
                )}

            </div>

        </div>
    );
}

export default Login;

