import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Matches
export const createMatch = (matchData) => api.post('/matches', matchData);
export const getMatches = () => api.get('/matches');
export const getMatch = (id) => api.get(`/matches/${id}`);
// Fetch all players

// Add multiple players
// In api.js, change the updateMatch function:
export const updateMatch = async (matchId, matchData) => {
  try {
    // Use the api instance that has the correct baseURL
    const response = await api.put(`/matches/${matchId}`, matchData);
    return response;
  } catch (error) {
    console.error('Error updating match:', error);
    throw error;
  }
};
// Teams
export const createTeam = (teamData) => api.post('/teams', teamData);
export const getTeams = () => api.get('/teams');
export const getTeam = (id) => api.get(`/teams/${id}`);

// Players
export const getPlayers = () => api.get('/players');
export const createPlayer = (playerData) => api.post('/players', playerData);
export const addPlayers = (players) => api.post('/players/bulk', { players });

export const getPlayer = (id) => api.get(`/players/${id}`);

export default api;