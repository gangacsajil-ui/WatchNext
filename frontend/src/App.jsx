import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("token") !== null
    );

    return (
        <div>
            {isLoggedIn ? (
                <Dashboard />
            ) : (
                <Login onLogin={() => setIsLoggedIn(true)} />
            )}
        </div>
    );
}

export default App;