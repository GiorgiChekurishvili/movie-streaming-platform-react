import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MEDIA_TYPE } from '../models/Constants/MediaType.js';
import '../styles/components/Navbar.scss';

const Navbar = () => {
    const [show, handleShow] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const scrollListener = () => handleShow(window.scrollY > 100);
        window.addEventListener("scroll", scrollListener);
        return () => window.removeEventListener("scroll", scrollListener);
    }, []);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate('/search', { state: { incomingQuery: searchQuery } });
            setSearchQuery('');
            setMenuOpen(false);
        }
    };

    const SearchInput = (className) => (
        <input
            type="text"
            placeholder="Search Movies, TV Series..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className={className}
        />
    );

    return (
        <nav className={`navbar ${show || menuOpen ? "nav-black" : ""} ${menuOpen ? "menu-open" : ""}`}>
            <div className="nav-left">
                <div
                    className={`menu-toggle ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>

                <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>STREAMFLIX</Link>

                <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
                    <div className="mobile-search-container">
                        {SearchInput("nav-search-input mobile")}
                    </div>

                    <Link className="nav-link-item" to={`/browse/${MEDIA_TYPE.MOVIE}`} onClick={() => setMenuOpen(false)}>Movies</Link>
                    <Link className="nav-link-item" to={`/browse/${MEDIA_TYPE.TV}`} onClick={() => setMenuOpen(false)}>TV Series</Link>
                    <Link className="nav-link-item" to="/anime" onClick={() => setMenuOpen(false)}>Anime</Link>
                    <Link className="nav-link-item" to="/channels" onClick={() => setMenuOpen(false)}>Channels</Link>
                </div>
            </div>

            <div className="nav-search-container desktop">
                {SearchInput("nav-search-input")}
            </div>
        </nav>
    );
};

export default Navbar;