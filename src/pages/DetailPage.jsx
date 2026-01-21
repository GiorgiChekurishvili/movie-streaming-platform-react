import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TMDBService from '../services/TMDBService';
import MovieCard from '../components/MovieCard';
import '../styles/pages/DetailPage.scss'

const DetailPage = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [seasons, setSeasons] = useState([]);
    const [activeSeason, setActiveSeason] = useState(1);
    const [episodes, setEpisodes] = useState([]);
    const [cast, setCast] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    // Logic for the main Play button
    const handlePlayMain = () => {
        if (type === 'movie') {
            navigate(`/watch/movie/${id}`);
        } else {
            const firstSeasonNum = seasons.length > 0 ? seasons[0].season_number : 1;
            navigate(`/watch/tv/${id}/${firstSeasonNum}/1`);
        }
    };

    const handlePlayEpisode = (seasonNum, episodeNum) => {
        navigate(`/watch/tv/${id}/${seasonNum}/${episodeNum}`);
    };

    useEffect(() => {
        const loadInitialData = async () => {
            const details = await TMDBService.getDetails(type, id);
            const actors = await TMDBService.getCredits(type, id);
            const suggested = await TMDBService.getRecommendations(type, id);

            setItem(details);
            setCast(actors.slice(0, 12));
            setRecommendations(suggested);
            window.scrollTo(0, 0);

            if (type === 'tv') {
                const tvData = await TMDBService.getTvDetails(id);
                const filteredSeasons = (tvData.seasons || []).filter(s => s.season_number > 0);
                setSeasons(filteredSeasons);

                if (filteredSeasons.length > 0) {
                    setActiveSeason(filteredSeasons[0].season_number);
                }
            }
        };
        loadInitialData();
    }, [type, id]);

    useEffect(() => {
        if (type === 'tv') {
            const fetchEpisodes = async () => {
                const epData = await TMDBService.getSeasonDetails(id, activeSeason);
                setEpisodes(epData || []);
            };
            fetchEpisodes();
        }
    }, [activeSeason, id, type]);

    if (!item) return <div className="loading">Loading...</div>;

    return (
        <div className="details-page">
            <div className="details-hero" style={{ backgroundImage: `url(${item.backdrop})` }}>
                <div className="details-overlay">
                    <div className="details-content">
                        <h1>{item.title}</h1>
                        <div className="details-meta">
                            <span className="rating">⭐ {Number(item.rating || 0).toFixed(1)}</span>
                            <span className="year">
                                {(item.release_date || item.first_air_date) ? new Date(item.release_date || item.first_air_date).getFullYear() : 'N/A'}
                            </span>
                        </div>
                        <p className="overview">{item.description || item.overview}</p>

                        <div className="actions">
                            <button className="play-now-btn" onClick={handlePlayMain}>Play Now</button>
                        </div>
                    </div>
                </div>
            </div>

            {type === 'tv' && (
                <div className="tv-browser">
                    <section className="seasons-section">
                        <h2>Seasons</h2>
                        <div className="seasons-tabs">
                            {seasons.map(s => (
                                <div
                                    key={s.id}
                                    className={`season-tab ${activeSeason === s.season_number ? 'active' : ''}`}
                                    onClick={() => setActiveSeason(s.season_number)}
                                >
                                    <h3>{s.name}</h3>
                                    <span>{s.episode_count} Episodes</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="episodes-section">
                        <div className="episodes-header">
                            <h2>Episodes</h2>
                            <span className="ep-count">{episodes.length} Episodes • Season {activeSeason}</span>
                        </div>
                        <div className="episodes-grid">
                            {episodes.map(ep => (
                                <div
                                    key={ep.id}
                                    className="episode-card"
                                    onClick={() => handlePlayEpisode(activeSeason, ep.episode_number)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="ep-image-wrapper">
                                        <img src={`https://image.tmdb.org/t/p/w300${ep.still_path}`} alt={ep.name} />
                                        <div className="ep-number-badge">{ep.episode_number}</div>
                                        <div className="ep-runtime">{ep.runtime}m</div>
                                        <div className="ep-title-overlay">{ep.name}</div>
                                    </div>
                                    <p className="ep-overview">{ep.overview || "No description available."}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}

            <div className="section cast-section">
                <h2>Actors</h2>
                <div className="cast-grid">
                    {cast.map(actor => (
                        <div key={actor.id} className="actor-card">
                            <img src={actor.profile_path ? `https://image.tmdb.org/t/p/w300${actor.profile_path}` : 'https://via.placeholder.com/300x450?text=No+Image'} alt={actor.name} />
                            <div className="actor-info">
                                <p className="actor-name">{actor.name}</p>
                                <p className="character">{actor.character}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="section recommendations-section">
                <h2>You May Also Like</h2>
                <div className="movie-row">
                    {recommendations.map(rec => (
                        <MovieCard key={rec.id} media={rec} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DetailPage;