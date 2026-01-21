import React, { useEffect, useState } from 'react';
import TMDBService from '../services/TMDBService';
import MovieCard from './MovieCard';
import { PROVIDER_LIST } from '../models/Constants/Providers.js';

import '../styles/components/ProviderRow.scss';

const ITEMS_PER_PAGE = 5;
const ANIMATION_DURATION = 450;

const ProviderRow = () => {
    const [activeProvider, setActiveProvider] = useState(PROVIDER_LIST[0]);
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [direction, setDirection] = useState(null);
    const [prevMovies, setPrevMovies] = useState([]);
    const [nextMovies, setNextMovies] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await TMDBService.getByProvider(activeProvider.id, 'tv');
            setMovies(data || []);
            setPage(0); // Reset page when provider changes
        };
        fetchData();
    }, [activeProvider]);

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
        <div className="provider-row">
            <div className="provider-navbar">
                <h2 className="row-title">Streaming on</h2>
                <div className="provider-tabs">
                    {PROVIDER_LIST.map((provider) => (
                        <button
                            key={provider.id}
                            className={`provider-tab ${activeProvider.id === provider.id ? 'active' : ''}`}
                            style={{ '--provider-color': provider.color }}
                            onClick={() => setActiveProvider(provider)}
                        >
                            {provider.name}
                        </button>
                    ))}
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

export default ProviderRow;