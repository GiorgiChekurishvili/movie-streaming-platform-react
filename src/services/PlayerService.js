// services/PlayerService.js

const BASE_PLAYER_URL = "https://vidsrc.cc/v2/embed";

class PlayerService {

    static getVideoUrl(type, id, season = 1, episode = 1) {
        let url = "";
        if (type === 'movie') {
            url = `${BASE_PLAYER_URL}/movie/${id}`;
        } else {
            url = `${BASE_PLAYER_URL}/tv/${id}/${season}/${episode}`;
        }
        return `${url}?autoPlay=1&mute=1&color=e50914`;
    }
}

export default PlayerService;