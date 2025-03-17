import axios from 'axios';      //used for api calls


const API = axios.create({ baseURL: 'http://localhost:5001/'})

export const refresh = () => API.get("/api/auth/refresh", { withCredentials: true },);   // no need for axiosPrivate, since this is refresh


export {API}



