export class Media {
    constructor(apiData) {
        this.id = apiData.id;
        this.title = apiData.title || apiData.name;
        this.description = apiData.overview;

        this.type = apiData.first_air_date ? 'tv' : 'movie';

        this.poster = apiData.poster_path
            ? `https://image.tmdb.org/t/p/w500${apiData.poster_path}`
            : null;
        this.release_date = apiData.release_date || apiData.first_air_date;
        this.backdrop = apiData.backdrop_path
            ? `https://image.tmdb.org/t/p/original${apiData.backdrop_path}`
            : null;
        this.rating = apiData.vote_average?.toFixed(1);

    }
}