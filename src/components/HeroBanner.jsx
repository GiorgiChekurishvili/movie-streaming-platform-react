import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TMDBService from '../services/TMDBService';
import '../styles/components/HeroBanner.scss';

const HeroBanner = () => {
    const [trending, setTrending] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrending = async () => {
            const data = await TMDBService.getTrendingAll('day');
            setTrending(data.slice(0, 10));
        };
        fetchTrending();
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === trending.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? trending.length - 1 : prev - 1));
    };

    const currentMedia = trending[currentIndex];

    if (!currentMedia) return <div className="hero-placeholder" />;

    return (
        <header
            className="hero-banner"
            style={{
                backgroundSize: "cover",
                backgroundImage: `url(${currentMedia.backdrop})`,
                backgroundPosition: "center center"
            }}
        >
            <button className="hero-nav-btn left" onClick={prevSlide}>❮</button>
            <button className="hero-nav-btn right" onClick={nextSlide}>❯</button>

            <div className="hero-contents">
                <h1 className="hero-title">{currentMedia.title}</h1>

                <div className="hero-buttons">
                    <button className="hero-button play" onClick={() => navigate(`/details/${currentMedia.type}/${currentMedia.id}`)}>Play Now</button>
                </div>

                <p className="hero-description">
                    {currentMedia.overview?.length > 150
                        ? currentMedia.overview.substring(0, 150) + "..."
                        : currentMedia.overview}
                </p>
            </div>

            <div className="hero-fade-bottom" />
        </header>
    );
};

export default HeroBanner;