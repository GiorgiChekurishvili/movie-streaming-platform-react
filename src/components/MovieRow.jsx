import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import { MEDIA_TYPE } from '../models/Constants/MediaType.js';
import '../styles/components/MovieRow.scss';

const ITEMS_PER_PAGE = 5;
const ANIMATION_DURATION = 450;

const MovieRow = ({ title, fetchMethod }) => {
    const [type, setType] = useState(MEDIA_TYPE.MOVIE);
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(0);
    const [prevMovies, setPrevMovies] = useState([]);
    const [nextMovies, setNextMovies] = useState([]);
    const [animating, setAnimating] = useState(false);
    const [direction, setDirection] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (fetchMethod) {
                const data = await fetchMethod(type);
                setMovies(data || []);
                setPage(0);
            }
        };
        fetchData();
    }, [type, fetchMethod]);

    const maxPage = Math.ceil(movies.length / ITEMS_PER_PAGE) - 1;

    const handlePageChange = (dir) => {
        if (animating) return;

        const newPage = dir === 'next' ? page + 1 : page - 1;
        if (newPage < 0 || newPage > maxPage) return;

        setDirection(dir);
        setPrevMovies(movies.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE));
        setNextMovies(movies.slice(newPage * ITEMS_PER_PAGE, newPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE));
        setAnimating(true);

        setTimeout(() => {
            setPage(newPage);
            setAnimating(false);
            setDirection(null);
        }, ANIMATION_DURATION);
    };

    const currentSlice = movies.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE);

    return (
        <div className="movie-row">
            <div className="row-header">
                <h2 className="row-title">{title}</h2>
                <div className="type-toggle">
                    <button
                        className={type === MEDIA_TYPE.MOVIE ? 'active' : ''}
                        onClick={() => setType(MEDIA_TYPE.MOVIE)}
                    >
                        Movies
                    </button>
                    <button
                        className={type === MEDIA_TYPE.TV ? 'active' : ''}
                        onClick={() => setType(MEDIA_TYPE.TV)}
                    >
                        Series
                    </button>
                </div>
            </div>

            <div className="row-wrapper">
                {page > 0 && (
                    <button className="row-arrow left" onClick={() => handlePageChange('prev')}>❮</button>
                )}
                {page < maxPage && (
                    <button className="row-arrow right" onClick={() => handlePageChange('next')}>❯</button>
                )}

                <div className="row-posters-container">
                    {animating && (
                        <div className={`row-posters animating-out slide-out-${direction}`}>
                            {prevMovies.map((item) => (
                                <MovieCard key={`prev-${item.id}`} media={item} />
                            ))}
                        </div>
                    )}

                    <div className={`row-posters ${animating ? `animating-in slide-in-${direction}` : ''}`}>
                        {(animating ? nextMovies : currentSlice).map((item) => (
                            <MovieCard key={`curr-${item.id}`} media={item} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieRow;