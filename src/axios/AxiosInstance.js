import axios from 'axios';
import {strings} from '../../locales/Language'
export const baseURL = 'https://sakba.net/mobileApi/';
const axiosInstance = axios.create({
    baseURL,
})

axiosInstance.interceptors.request.use((config) => {
    config.params = config.params || {};
    config.params['lang'] = strings.getLanguage();
    return config;
});

export default axiosInstance;
