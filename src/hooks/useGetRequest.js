import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useGettRequest = (
  url,
  setData,
  body,
  thenFunction = () => {},
  errorFunction = () => {},
  setLoading = () => {}
) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const fetchData = async (secondBody) => {
    setIsLoading(true);
    setLoading(true);

    const getUser = JSON.parse(sessionStorage.getItem("user"));
    // const RequestedUrl = `${process.env.REACT_APP_URL + url}`;
    const header = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getUser?.TOKEN,
    };

    await axios(url, {
      method: "GET",
      headers: header,
    })
      .then(function (data) {
        if (data?.data !== "") {
          console.groupCollapsed("Respuesta de Endpoint: " + url);
          console.log(data);
          console.groupEnd();
          setData(data?.data);
          setIsLoading(false);
          setLoading(false);
          thenFunction();
        } else {
          console.groupCollapsed("Data vacía de Endpoint: " + url);
          console.groupCollapsed("*DATA*");
          console.log(data);
          console.groupEnd();
          console.groupEnd();
          errorFunction();
        }
      })
      .catch((error) => {
        console.groupCollapsed("ERROR de Endpoint: " + url);
        console.log("STATUS: " + error.response.status);
        console.groupCollapsed("*DATA*");
        console.log(error);
        console.groupEnd();
        console.groupEnd();
        if (error.response.status == 403) {
          getNewToken();
        }
        errorFunction();
      });
  };

  const fetchDataAgain = async (secondBody) => {
    setIsLoading(true);
    setLoading(true);
    const getUser = JSON.parse(sessionStorage.getItem("user"));
    // const RequestedUrl = `${process.env.REACT_APP_URL + url}`;
    const header = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getUser?.TOKEN,
    };

    await axios(url, {
      method: "GET",
      headers: header,
    })
      .then(function (data) {
        if (data?.data !== "") {
          console.groupCollapsed(
            "Respuesta de Endpoint: " + url + " second time"
          );
          console.log(data);
          console.groupEnd();
          setData(data?.data);
          setIsLoading(false);
          setLoading(false);
          thenFunction();
        } else {
          console.groupCollapsed("ERROR de Endpoint: " + url);
          console.groupCollapsed("*DATA*");
          console.log(data);
          console.groupEnd();
          console.groupEnd();
          errorFunction();
        }
      })
      .catch((error) => {
        console.groupCollapsed("ERROR de Endpoint: " + url + " second time");
        console.log(typeof data);
        console.log(error.data);
        console.groupEnd();
        errorFunction();

        if (error.response.status == 403) {
          sessionStorage.clear();
          toast.error("Token vencido", { theme: "dark" });
          navigate("/login");
        }
      });
  };

  const getNewToken = async () => {
    const getUser = JSON.parse(sessionStorage.getItem("user"));
    const url = `${process.env.REACT_APP_URL}user/refresh-token`;

    const header = {
      "Content-Type": "application/json",
    };

    const body = JSON.stringify({
      refresh_token: getUser?.REFRESH_TOKEN,
    });

    await axios(url, {
      method: "POST",
      headers: header,
      data: body,
    })
      .catch((error) => {
        console.log(error);
        sessionStorage.clear();
        toast.error("Token vencido", { theme: "dark" });
        navigate("/login");
      })
      .then(function (response) {
        getUser.REFRESH_TOKEN = response.data.REFRESH_TOKEN;
        getUser.TOKEN = response.data.TOKEN;

        console.groupCollapsed("New tokens");
        console.group("REFRESH_TOKEN");
        console.log(response.data.REFRESH_TOKEN);
        console.groupEnd();
        console.group("TOKEN");
        console.log(response.data.TOKEN);
        console.groupEnd();
        console.groupEnd();

        sessionStorage.setItem("user", JSON.stringify(getUser));
        fetchDataAgain();
      });
  };

  return [fetchData, isLoading];
};

export default useGettRequest;
