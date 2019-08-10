import axios from 'axios';

const API_INSTANCE  = axios.create({
    baseURL : 'http://sincerelyever.com/mobileApi/',
    timeout : 2000,
    headers : {'X-Custom-Header': 'foobar'}
});

export default API_INSTANCE;