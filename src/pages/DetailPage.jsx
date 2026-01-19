import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TMDBService from '../services/TMDBService';
import MovieCard from '../components/MovieCard';
import '../styles/pages/DetailPage.scss'

const DetailPage = () => {
    const { type, id } = useParams();
    const [item, setItem] = useState(null);
    const [seasons, setSeasons] = useState([]);
    const [activeSeason, setActiveSeason] = useState(1);
    const [episodes, setEpisodes] = useState([]);
    const [cast, setCast] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const loadInitialData = async () => {
            const details = await TMDBService.getDetails(type, id);
            const actors = await TMDBService.getCredits(type, id);
            const suggested = await TMDBService.getRecommendations(type, id);

            setItem(details);
            setCast(actors.slice(0, 10));
            setRecommendations(suggested);
            window.scrollTo(0, 0);

            if (type === 'tv') {
                const tvData = await TMDBService.getTvDetails(id);
                setSeasons(tvData.seasons || []);
                const firstSeason = tvData.seasons.find(s => s.season_number > 0) || tvData.seasons[0];
                setActiveSeason(firstSeason.season_number);
            }
        };
        loadInitialData();
    }, [type, id]);

    useEffect(() => {
        if (type === 'tv') {
            const fetchEpisodes = async () => {
                const epData = await TMDBService.getSeasonDetails(id, activeSeason);
                setEpisodes(epData);
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
                            <span className="rating">{Number(item.rating || 0).toFixed(1)}</span>
                            <span className="year">{item.releaseDate ? new Date(item.releaseDate).getFullYear() : 'N/A'}</span>
                        </div>
                        <p className="overview">{item.overview}</p>

                        <div className="actions">
                            <button className="play-now-btn">Play Now</button>
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
                                <div key={ep.id} className="episode-card">
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
                <h2>Top Cast</h2>
                <div className="cast-grid">
                    {cast.map(actor => (
                        <div key={actor.id} className="actor-card">
                            <img src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} alt={actor.name} />
                            <p className="actor-name">{actor.name}</p>
                            <p className="character">{actor.character}</p>
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