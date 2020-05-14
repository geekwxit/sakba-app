import axios from 'axios';
import {strings} from '../../locales/Language'

const axiosInstance = axios.create({
    baseURL: 'https://sakba.net/mobileApi/',
})

axiosInstance.interceptors.request.use((config) => {
    config.params = config.params || {};
    config.params['lang'] = strings.getLanguage();
    return config;
});

export default axiosInstance;
