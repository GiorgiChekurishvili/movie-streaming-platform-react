import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TMDBService from '../services/TMDBService';
import PlayerService from '../services/PlayerService';
import '../styles/pages/WatchPage.scss';

const WatchPage = () => {
    const { type, id, season: urlSeason, episode: urlEpisode } = useParams();
    const navigate = useNavigate();

    const currentSeason = parseInt(urlSeason) || 1;
    const currentEpisode = parseInt(urlEpisode) || 1;

    const [allSeasons, setAllSeasons] = useState([]);
    const [episodes, setEpisodes] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);

    const videoUrl = PlayerService.getVideoUrl(type, id, currentSeason, currentEpisode);

    const handleExit = () => {
        navigate(`/details/${type}/${id}`);
    };

    useEffect(() => {
        if (type === 'tv') {
            TMDBService.getTvDetails(id).then(data => {
                const filtered = (data.seasons || []).filter(s => s.season_number > 0);
                setAllSeasons(filtered);
            });
        }
    }, [id, type]);

    useEffect(() => {
        if (type === 'tv') {
            TMDBService.getSeasonDetails(id, currentSeason).then(data => {
                setEpisodes(data || []);
            });
        }
    }, [id, currentSeason, type]);

    const handleSeasonChange = (e) => {
        const newSeason = e.target.value;
        navigate(`/watch/tv/${id}/${newSeason}/1`);
    };

    return (
        <div className="watch-page">
            <div className="controls-overlay">
                <div className="top-right-controls">
                    {type === 'tv' && (
                        <button className="menu-button" onClick={() => setShowSidebar(true)}>
                            <span>☰</span> Episodes
                        </button>
                    )}
                    <button className="exit-button" onClick={handleExit}>
                        ✕ Close
                    </button>
                </div>
            </div>

            <div className={`episode-sidebar ${showSidebar ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h3>Menu</h3>
                    <button className="close-btn" onClick={() => setShowSidebar(false)}>✕</button>
                </div>

                {type === 'tv' && (
                    <div className="sidebar-content">
                        <div className="season-selector">
                            <label>Select Season:</label>
                            <select value={currentSeason} onChange={handleSeasonChange}>
                                {allSeasons.map(s => (
                                    <option key={s.id} value={s.season_number}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="ep-list">
                            {episodes.map(ep => (
                                <div
                                    key={ep.id}
                                    className={`ep-item ${currentEpisode === ep.episode_number ? 'active' : ''}`}
                                    onClick={() => {
                                        navigate(`/watch/tv/${id}/${currentSeason}/${ep.episode_number}`, { replace: true });
                                        setShowSidebar(false);
                                    }}>
                                    <span>{ep.episode_number}.</span> {ep.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="video-frame-container">
                <iframe
                    src={videoUrl}
                    title="Player"
                    allowFullScreen
                    allow="autoplay; encrypted-media"
                    sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts"
                />
            </div>
        </div>
    );
};

export default WatchPage;