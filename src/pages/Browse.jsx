import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import TMDBService from '../services/TMDBService';
import MovieCard from '../components/MovieCard';
import '../styles/pages/Browse.scss';

const Browse = ({ type: propsType }) => {
    const { type: urlType } = useParams();
    const activeType = propsType || urlType;
    const scrollRef = useRef(null);

    const [items, setItems] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async (pageNum, isReset = false, currentGenre = selectedGenre) => {
        setLoading(true);
        try {
            const data = await TMDBService.getDiscover(activeType, currentGenre, pageNum);
            const validData = (data || []).filter(item => item.poster && !item.poster.includes('null'));
            setItems(prev => isReset ? validData : [...prev, ...validData]);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, [activeType, selectedGenre]);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            const onWheel = (e) => {
                if (e.deltaY === 0) return;
                const canScrollRight = el.scrollLeft < (el.scrollWidth - el.clientWidth - 1);
                const canScrollLeft = el.scrollLeft > 0;
                if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
                    e.preventDefault();
                    el.scrollLeft += e.deltaY;
                }
            };
            el.addEventListener('wheel', onWheel, { passive: false });
            return () => el.removeEventListener('wheel', onWheel);
        }
    }, [genres]);

    useEffect(() => {
        setSelectedGenre('');
        if (activeType !== 'anime') {
            TMDBService.getGenres(activeType).then(list => setGenres(list || []));
        } else {
            setGenres([]);
        }
    }, [activeType]);

    useEffect(() => {
        setPage(1);
        fetchData(1, true, selectedGenre);
        window.scrollTo(0, 0);
    }, [selectedGenre, activeType]);

    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop + 500 >= document.documentElement.offsetHeight) {
            if (!loading) setPage(prev => prev + 1);
        }
    }, [loading]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        if (page > 1) {
            fetchData(page, false, selectedGenre);
        }
    }, [page]);

    return (
        <div className="browse-container">
            <header className="browse-header">
                <h1>Browsing {activeType === 'movie' ? 'Movies' : activeType === 'tv' ? 'TV Shows' : 'Anime'}</h1>
                {activeType !== 'anime' && (
                    <div className="filters-wrapper">
                        <div className="category-filters" ref={scrollRef}>
                            <button
                                className={`genre-chip ${selectedGenre === '' ? 'active' : ''}`}
                                onClick={() => setSelectedGenre('')}
                            >
                                All
                            </button>
                            {genres.map(genre => (
                                <button
                                    key={genre.id}
                                    className={`genre-chip ${selectedGenre === genre.id ? 'active' : ''}`}
                                    onClick={() => setSelectedGenre(genre.id)}
                                >
                                    {genre.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            <div className="movie-grid">
                {items.map((item, index) => (
                    <MovieCard key={`${item.id}-${index}`} media={item} />
                ))}
            </div>

            {loading && <div className="loader"><p>Loading...</p></div>}
        </div>
    );
};

export default Browse;