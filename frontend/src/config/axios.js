import axios from 'axios';



const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Authorization: `bearer ${localStorage.getItem('token')}`,
    },
    withCredentials: true
});


export default axiosInstance
