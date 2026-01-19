import React from 'react';
import { Link } from 'react-router-dom';
import {useNavigate} from "react-router-dom";

import '../styles/components/MovieCard.scss';

const MovieCard = ({ media }) => {
    const navigate = useNavigate();
    const detailPath = `/details/${media.type}/${media.id}`;

    return (
        <Link to={detailPath} className="movie-card" onClick={() => navigate(`/details/${media.type}/${media.id}`)}>
            <div className="card-image-wrapper">
                <img
                    src={media.poster}
                    alt={media.title}
                    loading="lazy"
                />

                <div className="card-overlay">
                    <h3 className="card-title">{media.title}</h3>
                    <div className="card-meta">
                        <span>{media?.rating ? Number(media.rating).toFixed(1) : "N/A"}</span>
                        <span>{media.type?.toUpperCase() || "N/A"}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;