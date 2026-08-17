import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard({onLogout}) {
    const [media, setMedia] = useState([]);
    const [title, setTitle] = useState("");
    const [type, setType] = useState("Movie");
    const [status, setStatus] = useState("Unwatched");

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editType, setEditType] = useState("Movie");

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

    // Logout
    const handleLogout = () => {
        onLogout();
    };

    const toWatch = media.filter(
        (item) => item.status === "Unwatched"
    );

    const watched = media.filter(
        (item) => item.status === "Watched"
    );

    // Add movie/show
    const handleAdd = () => {
        const token = localStorage.getItem("token");

        if (!title.trim()) {
            return;
        }

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

    // Update rating
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

    // Mark as watched
    const handleStatusChange = (id) => {
        const token = localStorage.getItem("token");

        axios.patch(
            `http://127.0.0.1:8000/api/media/${id}/`,
            {
                status: "Watched"
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

    // Delete movie/show
    const handleDelete = (id) => {
        const token = localStorage.getItem("token");

        axios.delete(
            `http://127.0.0.1:8000/api/media/${id}/`,
            {
                headers: {
                    Authorization: `Token ${token}`
                }
            }
        )
        .then(() => {
            setMedia(
                media.filter((item) => item.id !== id)
            );
        })
        .catch((error) => {
            console.log(error);
        });
    };

    // Start editing
    const handleEdit = (item) => {
        setEditingId(item.id);
        setEditTitle(item.title);
        setEditType(item.type);
    };

    // Save editing
    const handleSaveEdit = (id) => {
        const token = localStorage.getItem("token");

        axios.patch(
            `http://127.0.0.1:8000/api/media/${id}/`,
            {
                title: editTitle,
                type: editType
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

            setEditingId(null);
            setEditTitle("");
            setEditType("Movie");
        })
        .catch((error) => {
            console.log(error);
        });
    };

    return (
        <div className="dashboard">

            {/* Header */}
            <header className="dashboard-header">

                <div className="brand">
                    <h1>WATCHNEXT</h1>
                    <span>YOUR MOVIE UNIVERSE</span>
                </div>

                <button
                    onClick={handleLogout}
                    className="logout-button"
                >
                    Logout
                </button>

            </header>

            {/* Add Movie */}
            <section className="add-section">

                <h2>Add Movie / Show</h2>

                <div className="add-form">

                    <input
                        type="text"
                        placeholder="Enter movie or show title"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                    />

                    <select
                        value={type}
                        onChange={(e) =>
                            setType(e.target.value)
                        }
                    >
                        <option value="Movie">
                            Movie
                        </option>

                        <option value="TV">
                            TV Show
                        </option>
                    </select>

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                    >
                        <option value="Unwatched">
                            To Watch
                        </option>

                        <option value="Watched">
                            Watched
                        </option>
                    </select>

                    <button
                        className="add-button"
                        onClick={handleAdd}
                    >
                        + Add
                    </button>

                </div>

            </section>

            {/* To Watch */}
            <section className="media-section">

                <div className="section-heading">
                    <h2>📌 To Watch</h2>
                    <span>{toWatch.length}</span>
                </div>

                {toWatch.length === 0 ? (
                    <p className="empty-message">
                        No movies or shows to watch yet.
                    </p>
                ) : (
                    <div className="media-grid">

                        {toWatch.map((item) => (

                            <div
                                className="media-card"
                                key={item.id}
                            >

                                {editingId === item.id ? (

                                    <div className="edit-form">

                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) =>
                                                setEditTitle(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <select
                                            value={editType}
                                            onChange={(e) =>
                                                setEditType(
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="Movie">
                                                Movie
                                            </option>

                                            <option value="TV">
                                                TV Show
                                            </option>
                                        </select>

                                        <div className="button-group">

                                            <button
                                                className="save-button"
                                                onClick={() =>
                                                    handleSaveEdit(
                                                        item.id
                                                    )
                                                }
                                            >
                                                Save
                                            </button>

                                            <button
                                                className="cancel-button"
                                                onClick={() =>
                                                    setEditingId(null)
                                                }
                                            >
                                                Cancel
                                            </button>

                                        </div>

                                    </div>

                                ) : (

                                    <>

                                        <div className="card-top">
                                            <div className="card-icon">
                                                🎬
                                            </div>

                                            <div
                                                className={`rating-badge ${
                                                    item.rating > 0
                                                        ? "rated"
                                                        : ""
                                                }`}
                                            >
                                                {item.rating}
                                            </div>
                                        </div>

                                        <h3>{item.title}</h3>

                                        <p className="media-type">
                                            {item.type === "TV"
                                                ? "TV Show"
                                                : "Movie"}
                                        </p>

                                        <div className="button-group">

                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    handleEdit(item)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="watch-button"
                                                onClick={() =>
                                                    handleStatusChange(
                                                        item.id
                                                    )
                                                }
                                            >
                                                ✓ Watched
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        item.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </>

                                )}

                            </div>

                        ))}

                    </div>
                )}

            </section>

            {/* Watched */}
            <section className="media-section">

                <div className="section-heading">
                    <h2>⭐ Watched</h2>
                    <span>{watched.length}</span>
                </div>

                {watched.length === 0 ? (
                    <p className="empty-message">
                        No watched movies or shows yet.
                    </p>
                ) : (
                    <div className="media-grid">

                        {watched.map((item) => (

                            <div
                                className="media-card"
                                key={item.id}
                            >

                                {editingId === item.id ? (

                                    <div className="edit-form">

                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) =>
                                                setEditTitle(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <select
                                            value={editType}
                                            onChange={(e) =>
                                                setEditType(
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="Movie">
                                                Movie
                                            </option>

                                            <option value="TV">
                                                TV Show
                                            </option>
                                        </select>

                                        <div className="button-group">

                                            <button
                                                className="save-button"
                                                onClick={() =>
                                                    handleSaveEdit(
                                                        item.id
                                                    )
                                                }
                                            >
                                                Save
                                            </button>

                                            <button
                                                className="cancel-button"
                                                onClick={() =>
                                                    setEditingId(null)
                                                }
                                            >
                                                Cancel
                                            </button>

                                        </div>

                                    </div>

                                ) : (

                                    <>

                                        <div className="card-top">

                                            <div className="card-icon">
                                                🎬
                                            </div>

                                            <div
                                                className={`rating-badge ${
                                                    item.rating > 0
                                                        ? "rated"
                                                        : ""
                                                }`}
                                            >
                                                {item.rating}
                                            </div>

                                        </div>

                                        <h3>{item.title}</h3>

                                        <p className="media-type">
                                            {item.type === "TV"
                                                ? "TV Show"
                                                : "Movie"}
                                        </p>

                                        <div className="rating">

                                            {[1, 2, 3, 4, 5].map(
                                                (star) => (

                                                    <button
                                                        key={star}
                                                        onClick={() =>
                                                            handleRating(
                                                                item.id,
                                                                star
                                                            )
                                                        }
                                                    >
                                                        {star <=
                                                        item.rating
                                                            ? "★"
                                                            : "☆"}
                                                    </button>

                                                )
                                            )}

                                        </div>

                                        <p className="rating-text">
                                            Rating: {item.rating}/5
                                        </p>

                                        <div className="button-group">

                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    handleEdit(item)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        item.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </>

                                )}

                            </div>

                        ))}

                    </div>
                )}

            </section>

        </div>
    );
}

export default Dashboard;

