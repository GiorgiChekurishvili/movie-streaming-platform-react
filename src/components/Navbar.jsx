import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MEDIA_TYPE } from '../models/Constants/MediaType.js';

import '../styles/components/Navbar.scss';

const Navbar = () => {
    const [show, handleShow] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const scrollListener = () => {
            if (window.scrollY > 100) {
                handleShow(true);
            } else {
                handleShow(false);
            }
        };
        window.addEventListener("scroll", scrollListener);
        return () => window.removeEventListener("scroll", scrollListener);
    }, []);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate('/search', { state: { incomingQuery: searchQuery } });
            setSearchQuery('');
        }
    };

    return (
        <nav className={`navbar ${show && "nav-black"}`}>
            <div className="nav-left">
                <Link to="/" className="logo">STREAMFLIX</Link>
                <Link to={`/browse/${MEDIA_TYPE.MOVIE}`}>Movies</Link>
                <Link to={`/browse/${MEDIA_TYPE.TV}`}>TV Series</Link>
                <Link to="/anime">Anime</Link>
                <Link to="/channels">Channels</Link>
            </div>
            <div className="nav-search-container">
                <input
                    type="text"
                    placeholder="Search Movies, TV Series..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    className="nav-search-input"
                />
            </div>
        </nav>
    );
};

export default Navbar;