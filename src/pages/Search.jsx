import React, { useState, useEffect } from 'react';
import TMDBService from '../services/TMDBService';
import MovieCard from '../components/MovieCard';
import { useLocation } from 'react-router-dom';
import { MEDIA_TYPE } from '../models/Constants/MediaType.js';
import '../styles/pages/Search.scss';

const Search = () => {
    const location = useLocation();
    const [query, setQuery] = useState(location.state?.incomingQuery || '');
    const [results, setResults] = useState([]);
    const [type, setType] = useState('multi');

    useEffect(() => {
        const performSearch = async () => {
            if (query) {
                const data = await TMDBService.search(query, type);
                const validData = data.filter(item => item.poster && !item.poster.includes('null'));
                setResults(validData);
            }
        };

        const delayDebounceFn = setTimeout(performSearch, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query, type]);

    return (
        <div className="search-page">
            <input
                className="search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for more..."
            />

                <div className="type-toggle">
                    <button
                        className={type === MEDIA_TYPE.MULTI ? 'active' : ''}
                        onClick={() => setType(MEDIA_TYPE.MULTI)}
                    >All</button>
                    <button
                        className={type === MEDIA_TYPE.MOVIE ? 'active' : ''}
                        onClick={() => setType(MEDIA_TYPE.MOVIE)}
                    >Movies</button>
                    <button
                        className={type === MEDIA_TYPE.TV ? 'active' : ''}
                        onClick={() => setType(MEDIA_TYPE.TV)}
                    >Series</button>
                </div>

            <div className="movie-grid">
                {results.length > 0 ? (
                    results.map(item => <MovieCard key={item.id} media={item} />)
                ) : (query && <p className="no-results">No results found for "{query}"</p>)}
            </div>
        </div>
    );
};

export default Search;