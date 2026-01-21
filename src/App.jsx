import React from 'react';
import {Routes, Route, useLocation} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import DetailPage from './pages/DetailPage';
import { MEDIA_TYPE } from './models/Constants/MediaType.js';
import Search from "./pages/Search.jsx";
import './App.scss'
import WatchPage from "./pages/WatchPage.jsx";

export default function App() {
    const location = useLocation();
    const isWatchPage = location.pathname.startsWith('/watch');
    return (
        <>
            {!isWatchPage && <Navbar />}
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/browse/:type" element={<Browse />} />

                <Route path="/details/:type/:id" element={<DetailPage />} />

                <Route path="/anime" element={<Browse type={MEDIA_TYPE.ANIME} />} />

                <Route path="/search" element={<Search />} />
                <Route path="/watch/:type/:id" element={<WatchPage />} />
                <Route path="/watch/:type/:id/:season/:episode" element={<WatchPage />} />
            </Routes>
        </>
    );
}