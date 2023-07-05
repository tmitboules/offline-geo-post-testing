import axios from "axios";

export default async function () {
  const request = axios.create({
    baseURL: 'http://localhost:3000/',
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
