import axios, { AxiosInstance, HeadersDefaults } from "axios";
import router from "../router/index";

// const baseApiUrl = process.env.VUE_APP_API_URL;
// console.log(baseApiUrl, 'baseApiUrl')
const apiCall: AxiosInstance = axios.create({
 //  baseURL: "https://dev-hlyongphase2api.devxportal.com/api/",
                   baseURL: "https://uat-hlyongapi.cssdemo.dev/api/",
              //  baseURL: "https://dev-hlyongapi.devxportal.com/api/",
 
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, PATCH, PUT, DELETE, OPTIONS",
    Accept: "application/json",
  },
  timeout: 10000,
});

function redirectToLogin() {
  localStorage.removeItem("permit");
  router.replace({
    path: "/login",
    name: "login",
    query: {
      redirect: router.currentRoute.fullPath,
    },
  });
}

apiCall.interceptors.request.use(
  (request) => {
    if (localStorage.getItem("permit")) {
      request.headers.Authorization = `Bearer ${localStorage.getItem(
        "permit"
      )}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiCall.interceptors.response.use(
  (response) => {
    if (response.status === 200 || response.status === 201) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    if (error.response.status && error.response.status === 401) {
      if (router.currentRoute.name != "Login") {
        redirectToLogin();
      }
    }
    return Promise.reject(error.response);
  }
);

export default apiCall;
