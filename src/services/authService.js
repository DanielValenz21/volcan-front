import axios from 'axios';

const API_URL = 'http://example.com/api'; // Example API URL

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw new Error('Error during login');
  }
};
