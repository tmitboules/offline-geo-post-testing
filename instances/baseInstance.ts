import axios from "axios";

export default async function () {
  const request = axios.create({
    baseURL: 'https://cc-gateway-service-wus2.azurewebsites.net/api',
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  request.defaults.timeout = 30000;

  request.interceptors.response.use(
    function (response) {
     
      return response;
    }
  );

  // "https://cc-gateway-service.azurewebsites.net/api/"

  return request;
}
