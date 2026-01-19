import React, { useEffect, useState } from 'react';
import TMDBService from '../services/TMDBService';
import MovieCard from './MovieCard';
import { PROVIDER_LIST } from '../models/Constants/Providers.js';

import '../styles/components/ProviderRow.scss';

const ProviderRow = () => {
    const [activeProvider, setActiveProvider] = useState(PROVIDER_LIST[0]);
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await TMDBService.getByProvider(activeProvider.id, 'tv');
            setMovies(data);
        };
        fetchData();
    }, [activeProvider]);

    return (
        <div className="provider-row">
            <div className="provider-navbar">
                <h2 className="row-title">Streaming on</h2>
                <div className="provider-tabs">
                    {PROVIDER_LIST.map((provider) => (
                        <button
                            key={provider.id}
                            className={`provider-tab ${activeProvider.id === provider.id ? 'active' : ''}`}
                            style={{
                                '--provider-color': provider.color,
                                borderColor: activeProvider.id === provider.id ? provider.color : 'transparent'
                            }}
                            onClick={() => setActiveProvider(provider)}
                        >
                            {provider.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="row-posters">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} media={movie} />
                ))}
            </div>
        </div>
    );
};

export default ProviderRow;