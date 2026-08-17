
import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
    const [media, setMedia] = useState([]);
    const [title, setTitle] = useState("");
    const [type, setType] = useState("Movie");
    const [status, setStatus] = useState("Unwatched");

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

    const toWatch = media.filter((item) => item.status === "Unwatched");
    const watched = media.filter((item) => item.status === "Watched");

    const handleAdd = () => {
        const token = localStorage.getItem("token");

        axios.post(
            "http://127.0.0.1:8000/api/media/",
            {
                title: title,
                type: type,
                status: status,
                rating: 0
            },
            {
                headers: {
                    Authorization: `Token ${token}`
                }
            }
        )
        .then((response) => {
            setMedia([...media, response.data]);
            setTitle("");
            setType("Movie");
            setStatus("Unwatched");
        })
        .catch((error) => {
            console.log(error);
        });
    };

    const handleRating = (id, rating) => {
        const token = localStorage.getItem("token");

        axios.patch(
            `http://127.0.0.1:8000/api/media/${id}/`,
            {
                rating: rating
            },
            {
                headers: {
                    Authorization: `Token ${token}`
                }
            }
        )
        .then((response) => {
            setMedia(
                media.map((item) =>
                    item.id === id ? response.data : item
                )
            );
        })
        .catch((error) => {
            console.log(error);
        });
    };

    return (
        <div>

            <h2>Add Movie / Show</h2>

            <input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <select
                value={type}
                onChange={(e) => setType(e.target.value)}
            >
                <option value="Movie">Movie</option>
                <option value="TV">TV</option>
            </select>

            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="Unwatched">To Watch</option>
                <option value="Watched">Watched</option>
            </select>

            <button onClick={handleAdd}>Add</button>

            <h1>WatchNext</h1>

            <h2>To Watch</h2>

            {toWatch.length === 0 ? (
                <p>No movies or shows to watch.</p>
            ) : (
                toWatch.map((item) => (
                    <div key={item.id}>
                        <h3>{item.title}</h3>
                        <p>Type: {item.type}</p>
                    </div>
                ))
            )}

            <h2>Watched</h2>

            {watched.length === 0 ? (
                <p>No watched movies or shows.</p>
            ) : (
                watched.map((item) => (
                    <div key={item.id}>
                        <h3>{item.title}</h3>
                        <p>Type: {item.type}</p>

                        <div>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() =>
                                        handleRating(item.id, star)
                                    }
                                >
                                    {star <= item.rating ? "★" : "☆"}
                                </button>
                            ))}
                        </div>

                        <p>Rating: {item.rating}/5</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default Dashboard;

