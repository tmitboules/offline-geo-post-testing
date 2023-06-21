import axios from "axios";

export default async function () {
  const request = axios.create({
    baseURL: 'https://cc-general-service-wus2.azurewebsites.net/',
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  request.interceptors.response.use(
    function (response) {
      return response;
    }
  );

  return request;
}
