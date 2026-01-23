import React, { useEffect, useState, useCallback, useRef } from 'react';
import TMDBService from '../services/TMDBService';
import MovieCard from '../components/MovieCard';
import { CHANNEL_LIST } from '../models/Constants/Channels.js';
import '../styles/pages/Browse.scss';

const Channels = () => {
    const [items, setItems] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(CHANNEL_LIST[0]?.id);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const scrollRef = useRef(null);

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
    }, []);

    const fetchChannelData = useCallback(async (pageNum, isReset = false) => {
        if (!selectedChannel) return;
        setLoading(true);
        try {
            const data = await TMDBService.getDiscoverByNetwork(selectedChannel, pageNum);
            const validData = (data || []).filter(item => item.poster && !item.poster.includes('null'));
            setItems(prev => isReset ? validData : [...prev, ...validData]);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedChannel]);

    useEffect(() => {
        setItems([]);
        setPage(1);
        fetchChannelData(1, true);
        window.scrollTo(0, 0);
    }, [selectedChannel, fetchChannelData]);

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
        if (page > 1) fetchChannelData(page, false);
    }, [page, fetchChannelData]);

    return (
        <div className="browse-container">
            <header className="browse-header">
                <h1>TV Channels</h1>
                <div className="filters-wrapper">
                    <div className="category-filters" ref={scrollRef}>
                        {CHANNEL_LIST.map(channel => (
                            <button
                                key={channel.id}
                                className={`genre-chip ${selectedChannel === channel.id ? 'active' : ''}`}
                                style={selectedChannel === channel.id ? {
                                    backgroundColor: channel.color,
                                    borderColor: channel.color,
                                    color: '#fff',
                                    boxShadow: `0 0 15px ${channel.color}44`
                                } : {}}
                                onClick={() => setSelectedChannel(channel.id)}
                            >
                                {channel.name}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="movie-grid">
                {items.map((item, index) => (
                    <MovieCard key={`${item.id}-${index}`} media={item} />
                ))}
            </div>

            {loading && <div className="loader">Loading shows...</div>}
            {!loading && items.length === 0 && (
                <div className="no-results">No shows found for this network.</div>
            )}
        </div>
    );
};

export default Channels;