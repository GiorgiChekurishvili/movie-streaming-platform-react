import React, {useEffect, useState} from 'react';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import { MEDIA_TYPE } from '../models/Constants/MediaType.js';
import TMDBService from "../services/TMDBService.js";
import ProviderRow from "../components/ProviderRow.jsx";
import '../styles/pages/Home.scss';

const Home = () => {
    const [featuredMovie, setFeaturedMovie] = useState(null);

    useEffect(() => {
        const fetchHomeData = async () => {
            const trending = await TMDBService.getDiscover(MEDIA_TYPE.MOVIE);

            const randomIndex = Math.floor(Math.random() * 10);
            setFeaturedMovie(trending[randomIndex]);
        };
        fetchHomeData();
    }, []);

    return (
        <div className="home">
            <HeroBanner movie={featuredMovie} />

            <div className="rows-container">
                <MovieRow
                    title="Trending Today"
                    fetchMethod={(type) => TMDBService.getTrending(type, 'day')}
                />
                <MovieRow
                title="Trending This Week"
                fetchMethod={(type) => TMDBService.getTrending(type, 'week')}
                />
                <MovieRow
                    title="Top Rated"
                    fetchMethod={(type) =>TMDBService.getTopRated(type)}
                />
                <ProviderRow />
            </div>
        </div>
    );
};
export  default  Home