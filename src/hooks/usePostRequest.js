import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CheckVersion from "./useCheckVersion";

const usePostRequest = (
  url,
  setData,
  body,
  thenFunction = () => {},
  errorFunction = () => {},
  setLoading = () => {}
) => {
  CheckVersion();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ****************************************************************************
  // Corrección de data si no se necesita "setData" para renderizar
  // ****************************************************************************

  let newSetData = typeof setData === "object" ? () => {} : setData;
  let newBody = typeof setData === "object" ? setData : body;
  let newThenFunction = typeof setData === "object" ? body : thenFunction;
  let newErrorFunction =
    typeof setData === "object" ? thenFunction : errorFunction;
  let newSetLoading = typeof setData === "object" ? errorFunction : setLoading;

  // ****************************************************************************

  const fetchData = async (secondBody) => {
    setIsLoading(true);
    newSetLoading(true);
    let responseData;
    const getUser = JSON.parse(sessionStorage.getItem("user"));
    const header = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getUser?.TOKEN,
    };
    if (typeof newSetData !== "function") {
    }
    await axios(url, {
      method: "POST",
      headers: header,
      data: secondBody === undefined ? JSON.stringify(newBody) : secondBody,
    })
      .then(function (data) {
        if (data?.data !== "") {
          newSetData(data?.data);

          newSetLoading(false);
          responseData = data?.data;
          newThenFunction(data?.data);
        } else {
          newErrorFunction(data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error?.message:", error?.response?.status);
        if (
          error?.response?.status === 403 ||
          error?.message === "Network Error"
        ) {
          console.log("pasa al ser error");
          getNewToken();
        } else if (
          error?.response?.status === 401 ||
          error?.message === "Unauthorized"
        ) {
          toast.error("No posee permiso para esta opción", { theme: "dark" });
          setIsLoading(false);
          newErrorFunction(error?.response?.data);
        } else {
          if (error.response?.data?.message) {
            newSetData(JSON.parse(error.response?.data?.message));
          }
          setIsLoading(false);
          newErrorFunction(error?.response?.data);
        }
      });
    // console.log(responseData);
    return responseData;
  };

  const fetchDataAgain = async (secondBody) => {
    setIsLoading(true);
    newSetLoading(true);
    const getUser = JSON.parse(sessionStorage.getItem("user"));
    const header = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getUser?.TOKEN,
    };

    await axios(url, {
      method: "POST",
      headers: header,
      data: secondBody === undefined ? JSON.stringify(newBody) : secondBody,
    })
      .then(function (data) {
        if (data?.data !== "") {
          newSetData(data?.data);

          newSetLoading(false);

          newThenFunction(data?.data);
        } else {
          newErrorFunction(data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error?.response?.status:", error?.response?.status);

        if (
          error?.response?.status === 403 ||
          error?.message === "Network Error"
        ) {
          sessionStorage.clear();
          toast.error("Token vencido", { theme: "dark" });
          navigate("/login");
        } else {
          if (error.response?.data?.message) {
            newSetData(JSON.parse(error.response?.data?.message));
          }
          setIsLoading(false);
          newErrorFunction(error?.response?.data);
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
        sessionStorage.clear();
        toast.error("Token vencido", { theme: "dark" });
        navigate("/login");
      })
      .then(function (response) {
        getUser.REFRESH_TOKEN = response.data.REFRESH_TOKEN;
        getUser.TOKEN = response.data.TOKEN;

        sessionStorage.setItem("user", JSON.stringify(getUser));
        fetchDataAgain();
      });
  };

  return [fetchData, isLoading];
};

export default usePostRequest;
