import axios from 'axios';
import BASE_API_URL from '../apiConfig';

const API_URL = `${BASE_API_URL}/api`;

const fetchTodaySchedule = async () => {
  const response = await axios.get(`${API_URL}/live-programs/today`);
  return response.data;
};

export default {
  fetchTodaySchedule,
};
