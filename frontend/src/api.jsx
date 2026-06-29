import axios from 'axios';

// React automatically chooses the right URL based on where the app is running!
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://clutch-backend-xyrw.onrender.com' // We will replace this with your actual Google Cloud URL later!
  : 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;