import axios from 'axios';
import { sessionExpired } from './service';

const TIMEOUT = 3 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;

const updateHeaders = () => {
  let _headers =  JSON.parse(sessionStorage.getItem('_alt_headers')) || {};
  let _csrfHeader = [
    'sisp-p',
    'sisp-a',
    'sisp-o'
  ];
  function setHeaders(obj) {
    if(obj){
      _headers = _csrfHeader.reduce((acc, hd) => {
        if (obj[hd]) {
          acc[hd] = obj[hd];
        }
        return acc;
      }, _headers);
      sessionStorage.setItem('_alt_headers', JSON.stringify(_headers));
    }
  }
  function getHeaders() {
     return _headers;
  }
 return { setHeaders, getHeaders };
};


const setupAxiosInterceptors = (store) => {
  let headers = updateHeaders();

  const onRequestSuccess = config => {
    let _headers = headers.getHeaders();    
    config.headers = {...config.headers, ..._headers}
    return config;
  };
  
  const onResponseSuccess = response => {
    let urlString = response['request']['responseURL'];
    headers.setHeaders(response.headers);
    if(urlString && urlString.indexOf('logout') > -1)
        sessionExpired();
    return response;
  };

  const onResponseError = err => {
    try{
      headers.setHeaders(err.response.headers);
      const status = err.status || err.response.status;
      if (status === 401)
        sessionExpired();

    } catch(e) {
      console.log(e);
      return Promise.reject(err);
    }
    return Promise.reject(err);
  };
  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;