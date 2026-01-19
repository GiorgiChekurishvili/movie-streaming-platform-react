import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import DetailPage from './pages/DetailPage';
import { MEDIA_TYPE } from './models/Constants/MediaType.js';
import Search from "./pages/Search.jsx";
import './App.scss'

export default function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/browse/:type" element={<Browse />} />

                <Route path="/details/:type/:id" element={<DetailPage />} />

                <Route path="/anime" element={<Browse type={MEDIA_TYPE.ANIME} />} />

                <Route path="/search" element={<Search />} />
            </Routes>
        </>
    );
}