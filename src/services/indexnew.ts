import axios, { AxiosInstance, HeadersDefaults } from "axios";
import router from '../router/index';

// const baseApiUrl = process.env.VUE_APP_API_URL;
// console.log(baseApiUrl, 'baseApiUrl')
const apiCallnew: AxiosInstance = axios.create({
    baseURL: "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCFZHYloa-ArBR5haK90wAH3_EB9eIiOIE",
    // baseURL: "https://uat-gmccrmapi.devxportal.com/api/",
    // baseURL: "https://erpapi.gmcsg.com.sg/api/",
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, PATCH, PUT, DELETE, OPTIONS",
        "Accept": "application/json",
    },
    timeout: 10000,
});



export default apiCallnew;