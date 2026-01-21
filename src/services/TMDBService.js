import { Media } from '../models/Media';
import {MEDIA_TYPE} from "../models/Constants/MediaType.js";

const BASE_URL = 'https://api.themoviedb.org/3';
const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZDljYTUzNmViZmU2NGI5ODEzMTZmNTBkNmUzOWQ4NiIsIm5iZiI6MTc2ODU5MTkwMS4xMTEsInN1YiI6IjY5NmE5MjFkNzdjZjMwZDhmMzgzNDZmOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fhbOF1WXCv2Clitsf7lhP6NvLV3jx7aVzzlzXhYBlIs";

export default class TMDBService {
    static get _options() {
        return {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${TOKEN}`
            }
        };
    }
    static async _fetchFromTMDB(endpoint) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, this._options);

            if (!response.ok) {
                console.error(`API Error: ${response.status} at ${endpoint}`);
                return null;
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("Received non-JSON response from TMDB");
                return null;
            }

            const data = await response.json();

            if (data.results) {
                return data.results.map(item => new Media(item));
            }
            return data ? new Media(data) : null;
        } catch (error) {
            console.error("TMDB Fetch Error:", error);
            return null;
        }
    }

    static async getTrending(type = 'movie', time = 'week') {
        return await this._fetchFromTMDB(`/trending/${type}/${time}`);
    }
    static async getTrendingAll(time = 'day') {
        return await this._fetchFromTMDB(`/trending/all/${time}`);
    }
    static async getTopRated(type = 'movie'){
        return await this._fetchFromTMDB(`/${type}/top_rated`);
    }
    static async getGenres(type) {
        const fetchType = (type === 'movie' || type === 'tv') ? type : 'movie';
        try {
            const response = await fetch(`${BASE_URL}/genre/${fetchType}/list`, this._options);
            const data = await response.json();
            return data.genres || [];
        } catch (error) {
            console.error("Error fetching genres:", error);
            return [];
        }
    }
    static async getDiscover(type, selectedGenreId = null, page = 1) {
        if (type !== 'anime') {
            let endpoint = `/discover/${type}?sort_by=popularity.desc&page=${page}`;
            if (selectedGenreId) {
                endpoint += `&with_genres=${selectedGenreId}`;
            }
            return await this._fetchFromTMDB(endpoint);
        }
        const commonParams = `with_genres=16&with_original_language=ja&sort_by=popularity.desc&page=${page}`;

        const [movies, tvShows] = await Promise.all([
            this._fetchFromTMDB(`/discover/movie?${commonParams}`),
            this._fetchFromTMDB(`/discover/tv?${commonParams}`)
        ]);

        return [...tvShows, ...movies].sort((a, b) => b.popularity - a.popularity);
    }

    static async getByProvider(providerId, type = 'tv') {
        const endpoint = `/discover/${type}?sort_by=popularity.desc&watch_region=US&with_watch_providers=${providerId}`;
        return await this._fetchFromTMDB(endpoint);
    }
    static async search(query, type = 'multi') {
        return await this._fetchFromTMDB(`/search/${type}?query=${encodeURIComponent(query)}`);
    }
    static async getDetails(type = 'movie', id) {
        const endpoint = `/${type}/${id}?append_to_response=videos,credits,external_ids`;
        return await this._fetchFromTMDB(endpoint);
    }
    static async getTvDetails(id) {
        const response = await fetch(`${BASE_URL}/tv/${id}`, this._options);
        return await response.json();
    }
    static async getRecommendations(type, id) {
        return await this._fetchFromTMDB(`/${type}/${id}/recommendations`);
    }
    static async getCredits(type, id) {
        const response = await fetch(`${BASE_URL}/${type}/${id}/credits`, this._options);
        const data = await response.json();
        return data.cast || [];
    }
    static async getSeasonDetails(tvId, seasonNumber = 1) {
        const response = await fetch(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}`, this._options);
        const data = await response.json();
        return data.episodes || [];
    }
}