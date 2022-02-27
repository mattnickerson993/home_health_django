import axios from 'axios';
import { api } from '../api';
import { getAuthHeaders } from '../config/config';

import { getRefreshToken, setLocalStorage } from '../utils/storage';


const axiosInstance = axios.create({
	timeout: 5000,
    headers: getAuthHeaders()
});


axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {
        console.log('error', error.response)
        console.log('error', error.message)
		const originalRequest = error.config;
        // unknown error occurs
		if (typeof error.response === 'undefined') {
			console.log(
				'A server/network error occurred. ' +
					'Looks like CORS might be the problem. ' +
					'Sorry about this - we will get it fixed shortly.'
			);
			return Promise.reject(error);
		}
        // tried refresh token that's expired -- redirect to login
		if (
			error.response.status === 401 &&
			originalRequest.url === api.auth.refresh
		) {
			window.location.href = '/login/';
			return Promise.reject(error);
		}
        // requests that have expired access token -- try to refresh given:
        // refresh token exists -- see below for more details
		if (
			error.response.data.code === 'token_not_valid' &&
			error.response.status === 401 &&
			error.response.statusText === 'Unauthorized'
		) { 
            const refreshToken = getRefreshToken()

			if (refreshToken) {
				const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

				// exp date in token is expressed in seconds, while now() returns milliseconds:
				const now = Math.ceil(Date.now() / 1000);
				console.log('exp dat', tokenParts.exp);
                // token hasn't expired
				if (tokenParts.exp > now) {
					return axiosInstance
						.post(api.auth.refresh, { refresh: refreshToken })
						.then((response) => {
							// response is valid - set new creds
                            setLocalStorage(response.data)
                            // set new header for axios instance
							axiosInstance.defaults.headers['Authorization'] =
								'JWT ' + response.data.access;
                            // set new header for original request
							originalRequest.headers['Authorization'] =
								'JWT ' + response.data.access;

							return axiosInstance(originalRequest);
						})
						.catch((err) => {
							console.log(err);
						});
				} else {
                    // token expired -- redirect to login
					console.log('Refresh token is expired', tokenParts.exp, now);
					window.location.href = '/login/';
				}
			} else {
				console.log('Refresh token not available.');
				window.location.href = '/login/';
			}
		}

		// errors outside of the above ( ie not 401 errors)
		return Promise.reject(error);
	}
);

export default axiosInstance;