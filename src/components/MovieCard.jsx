import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/MovieCard.scss';

const MovieCard = ({ media }) => {
    const detailPath = `/details/${media.type}/${media.id}`;

    return (
        <Link to={detailPath} className="movie-card">
            <div className="card-image-wrapper">
                <img
                    src={media.poster}
                    alt={media.title}
                    loading="lazy"
                />

                <div className="card-overlay">
                    <h3 className="card-title">{media.title}</h3>
                    <div className="card-meta">
                        <div className="meta-left">
                            <span className="rating">⭐ {media?.rating ? Number(media.rating).toFixed(1) : "N/A"}</span>
                            <span className="separator">•</span>
                            <span className="year">{media.release_date ? new Date(media.release_date).getFullYear() : "N/A"}</span>
                        </div>
                        <span className="type-badge">
                            {media.type === 'tv' ? 'TV' : 'MOVIE'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;