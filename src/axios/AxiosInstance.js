import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://sakba.net/mobileApi/',
})

export default axiosInstance;
