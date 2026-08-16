import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
    const [media, setMedia] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios.get("http://127.0.0.1:8000/api/media/", {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then((response) => {
            setMedia(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);

    return (
        <div>
            <h1>WatchNext</h1>

            <h2>My Movies & Shows</h2>

            {media.map((item) => (
                <div key={item.id}>
                    <h3>{item.title}</h3>
                    <p>{item.type}</p>
                    <p>{item.status}</p>
                </div>
            ))}
        </div>
    );
}

export default Dashboard;