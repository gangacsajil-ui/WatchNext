import React, { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

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

    return (
        <div>
            <h2>Login to WatchNext</h2>

            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <br />
                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br />
                <br />

                <button type="submit">Login</button>
            </form>

            <p>{message}</p>
        </div>
    );
}

export default Login;