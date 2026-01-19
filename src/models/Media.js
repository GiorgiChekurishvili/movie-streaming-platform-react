export class Media {
    constructor(apiData) {
        this.id = apiData.id;
        this.title = apiData.title || apiData.name;
        this.description = apiData.overview;

        this.type = apiData.first_air_date ? 'tv' : 'movie';

        this.poster = apiData.poster_path
            ? `https://image.tmdb.org/t/p/w500${apiData.poster_path}`
            : null;

        this.backdrop = apiData.backdrop_path
            ? `https://image.tmdb.org/t/p/original${apiData.backdrop_path}`
            : null;
        this.rating = apiData.vote_average?.toFixed(1);
        this.year = (apiData.release_date || apiData.first_air_date || "").split("-")[0];

        this.imdbId = apiData.external_ids?.imdb_id || null;
    }
}