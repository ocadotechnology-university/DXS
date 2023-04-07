import axios from 'axios';
import { Storage } from 'react-jhipster';

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = SERVER_API_URL;

const setupAxiosInterceptors = onUnauthenticated => {
  const onRequestSuccess = config => {
    return config;
  };
  const onResponseSuccess = response => response;
  const onResponseError = err => {
    const status = err.status || (err.response ? err.response.status : 0);
    const url = err.config.url;

    // Ignore 401 errors from the root URL
    if (status === 401 && url === 'api/account') {
      return;
    }

    if (status === 403 || status === 401) {
      // If you want to perform any additional logic for 401 errors, add it here
      if (status === 401) {
        // Display a custom message for unauthorized requests
        const message = 'Unauthorized: Please log in.';
        return Promise.reject({ message });
      }
      onUnauthenticated();
      // Return the error response without throwing it
      return Promise.reject(err.response);
    }
    return Promise.reject(err);
  };
  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
