import React, { useEffect, useState, useRef } from 'react';
import MovieCard from './MovieCard';
import { MEDIA_TYPE } from '../models/Constants/MediaType.js';

import '../styles/components/MovieRow.scss';

const MovieRow = ({ title, fetchMethod }) => {
    const [type, setType] = useState(MEDIA_TYPE.MOVIE);
    const [movies, setMovies] = useState([]);
    const rowRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            if (fetchMethod) {
                const data = await fetchMethod(type);
                setMovies(data);
            }
        };
        fetchData();
    }, [type, fetchMethod]);

    return (
        <div className="movie-row">
            <div className="row-header">
                <h2 className="row-title">{title}</h2>
                <div className="type-toggle">
                    <button
                        className={type === MEDIA_TYPE.MOVIE ? 'active' : ''}
                        onClick={() => setType(MEDIA_TYPE.MOVIE)}
                    >Movies</button>
                    <button
                        className={type === MEDIA_TYPE.TV ? 'active' : ''}
                        onClick={() => setType(MEDIA_TYPE.TV)}
                    >Series</button>
                </div>
            </div>

            <div className="row-wrapper">
                <div className="row-posters" ref={rowRef}>
                    {movies.map((item) => (
                        <MovieCard key={item.id} media={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieRow;