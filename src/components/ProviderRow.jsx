import React, { useEffect, useState, useCallback } from 'react';
import TMDBService from '../services/TMDBService';
import MovieCard from './MovieCard';
import { PROVIDER_LIST } from '../models/Constants/Providers.js';

import '../styles/components/ProviderRow.scss';

const ANIMATION_DURATION = 450;

const ProviderRow = () => {
    const [activeProvider, setActiveProvider] = useState(PROVIDER_LIST[0]);
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [animating, setAnimating] = useState(false);
    const [direction, setDirection] = useState(null);
    const [prevMovies, setPrevMovies] = useState([]);
    const [nextMovies, setNextMovies] = useState([]);

    const updateItemsPerPage = useCallback(() => {
        const width = window.innerWidth;
        let count = 5;
        if (width <= 500) count = 2;
        else if (width <= 800) count = 3;
        else if (width <= 1200) count = 4;

        setItemsPerPage(count);
        setPage(0);
    }, []);

    useEffect(() => {
        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);
        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, [updateItemsPerPage]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await TMDBService.getByProvider(activeProvider.id, 'tv');
            setMovies(data || []);
            setPage(0);
        };
        fetchData();
    }, [activeProvider]);

    const maxPage = Math.ceil(movies.length / itemsPerPage) - 1;

    const handlePageChange = (dir) => {
        if (animating) return;

        const newPage = dir === 'next' ? page + 1 : page - 1;
        if (newPage < 0 || newPage > maxPage) return;

        setDirection(dir);
        setPrevMovies(movies.slice(page * itemsPerPage, (page + 1) * itemsPerPage));
        setNextMovies(movies.slice(newPage * itemsPerPage, (newPage + 1) * itemsPerPage));
        setAnimating(true);

        setTimeout(() => {
            setPage(newPage);
            setAnimating(false);
            setDirection(null);
        }, ANIMATION_DURATION);
    };

    const currentSlice = movies.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

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
                    <div
                        className={`row-posters ${animating ? `animating-in slide-in-${direction}` : ''}`}
                        style={{ gridTemplateColumns: `repeat(${itemsPerPage}, 1fr)` }}
                    >
                        {(animating ? nextMovies : currentSlice).map((item) => (
                            <MovieCard key={`curr-${item.id}`} media={item} />
                        ))}
                    </div>

                    {animating && (
                        <div
                            className={`row-posters animating-out slide-out-${direction}`}
                            style={{ gridTemplateColumns: `repeat(${itemsPerPage}, 1fr)` }}
                        >
                            {prevMovies.map((item) => (
                                <MovieCard key={`prev-${item.id}`} media={item} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProviderRow;