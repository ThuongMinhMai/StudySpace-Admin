import axios from "axios"

const studySpaceAPI = axios.create({
    baseURL: 'https://api-ss.diavan-valuation.asia',
    timeout: 10000,
    headers: {
      "Content-Type": "application/json"
    }
  })
  studySpaceAPI.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (!(config.data instanceof FormData)) {
            config.headers.Accept = 'application/json';
            config.headers['Content-Type'] = 'application/json';
        } else {
            // Khi sử dụng FormData, trình duyệt tự động thiết lập Content-Type
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// busAPI.interceptors.response.use(
// 	(response) => response.data,
// 	(error) => {
// 		if (error.response.status === 401) {
// 			/* empty */
// 		}
// 		return Promise.reject(error)
// 	},
// )
export default studySpaceAPI