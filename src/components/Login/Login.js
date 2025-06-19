import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useOnChange from "../../hooks/useOnChange";
import logo from "../../assets/LogoURP.png";
import yachay from "../../assets/sublogo_yachayhuasi.webp";
import tittle from "../../assets/yachay_fuente.png";
import texto from "../../assets/oficic.png";
import "./Login.css";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import packageJson from "../../../package.json";
import Swal from "sweetalert2";
import { IconButton } from "@mui/material";

const LoginRefactor = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  //const token = params.get("token");
  const token = params.get("payload");
  console.log("Token from URL:", token);
  const refreshToken = params.get("refreshToken");
  const [loadingToken, setLoadingToken] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const changeVisibility = () => {
    setVisibility(!visibility);
  };

  useEffect(() => {
    if (token !== null) {
      setLoadingToken(true);
      loginToken();
    }
  }, []);

  const [captureInputs, setCaptureInputs] = useState({
    username: "",
    password: "",
  });

  const [saveLogin, setSaveLogin] = useState([]);
  const { username, password } = captureInputs;
  const [validationLogin, setValidationLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savePeriod, setSavePeriod] = useState([]);
  /* const getPeriod = async (token) => {
    const url = `${process.env.REACT_APP_URL}generales/periodo`;
    const header = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };
    await axios(url, {
      method: "POST",
      headers: header,
    })
      .catch((error) => {
        console.groupCollapsed("ERROR de Endpoint period");
        console.groupCollapsed("*HEADER*");
        console.groupEnd();
        console.groupCollapsed("*DATA*");
        console.groupEnd();
        console.groupEnd();
        setLoading(false);
        // sessionStorage.clear();
        navigate("/login");
        toast.error("No se tiene un periodo asignado", {
          theme: "dark",
        });
        toast.error(JSON.parse(error.response.data.message).DETAIL, {
          theme: "dark",
        });
      })
      .then(function (response) {
        console.groupCollapsed("Respuesta de Endpoint period");
        console.groupCollapsed("*DATA*");
        console.groupEnd();
        console.groupEnd();
        setSavePeriod(response.data);
        toast.success("Usuario autenticado", {
          theme: "dark",
        });
        sessionStorage.setItem(
          "periodDefault",
          JSON.stringify(response.data[0])
        );
        window.location.reload();
      });
  }; */

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCaptureInputs({
      ...captureInputs,
      [e.target.name]: e.target.value,
    });
  };

  const sendLogin = async () => {
    try {
      const url = `${process.env.REACT_APP_URL}user/v2/auth`;

      const header = {
        "Content-Type": "application/json",
      };
      const body = JSON.stringify({
        username: username,
        clave: password,
      });

      const data = await axios(url, {
        method: "POST",
        headers: header,
        data: body,
      });

      setSaveLogin(data?.data);
      /* getPeriod(data.data.TOKEN); */
      window.location.reload();
    } catch (error) {
      setLoading(false);
      toast.error("Algo salio mal", {
        theme: "dark",
      });
    }
  };

  const loginToken = async () => {
    try {
      const url = `${process.env.REACT_APP_URL}user/auth-token`;

      const header = {
        "Content-Type": "application/json",
      };

      const body = JSON.stringify({
        payload: token,
      });

      const data = await axios(url, {
        method: "POST",
        headers: header,
        data: body,
      });
      // print(data?.data?.TOKEN);
      setSaveLogin(data?.data);
      /* getPeriod(data?.data?.TOKEN); */
      window.location.reload();
    } catch (error) {
      setLoading(false);
      toast.error("Algo salio mal", {
        theme: "dark",
      });
      setLoadingToken(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if ([username, password].includes("")) {
      setValidationLogin(true);
      return;
    }
    sendLogin();
    setLoading(true);
  };

  useOnChange(() => {
    sessionStorage.setItem("user", JSON.stringify(saveLogin));
    sessionStorage.setItem(
      "version",
      JSON.stringify({ version: packageJson.version })
    );
  }, [saveLogin]);

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  /* Funcion para cerrar los Sweet Alert abiertos TODO: ELIMINAR SWEET ALERT*/
  useEffect(() => {
    const getUser = JSON.parse(sessionStorage.getItem("user"));
    if (getUser === null) {
      Swal.close();
    }
  }, []);

  return (
    <div className="BG_login">
      <div className="BG_der animate__animated animate__fadeInRight"></div>

      <div className="BG_izq animate__animated animate__fadeInLeft"></div>
      <form
        onSubmit={handleSubmit}
        className="flex justify-end items-center relative min-h-screen bg-cover bg-center mx-5"
      >
        <div className="m-3 absolute top-0 left-0 ancho_movil w-20 md:w-20 animate__animated animate__fadeInLeftBig">
          <img src={logo} alt="Logo_URP" />
        </div>
        <div className="flex w-full justify-center center_login form_right">
          <div className="flex flex-col mx-5 w-1/4 form_container form_container2 animate__animated animate__fadeInUpBig">
            <div className="w-720 form_container_altura color_box  form_border pt-5 shadow-lg shadow-gray-800 opacity-40" />
            <div className="flex flex-col ancho_input w-64 input_margin gap-5 absolute completar mt-4 form_left justify-center items-center">
              {!loadingToken ? (
                <>
                  <div className="flex w-full mt-5  rounded-md border-4 bg_input border_input">
                    <input
                      className=" w-full px-2 py-1 rounded-r-sm font-medium input_letter text-gray-400 outline-none"
                      placeholder="USUARIO"
                      name="username"
                      value={username}
                      onChange={handleChange}
                    />
                    <IconButton size="small" disabled>
                      <PersonIcon className="ml-0.5 text-white" />
                    </IconButton>
                  </div>
                  <div className="flex w-full  rounded-md border-4 bg_input border_input">
                    <input
                      className="w-full px-2 py-1 rounded-r-sm font-medium input_letter text-gray-300 outline-none"
                      placeholder="CONTRASEÑA"
                      type={visibility === false ? "password" : "text"}
                      name="password"
                      value={password}
                      onChange={handleChange}
                    />
                    <IconButton
                      size="small"
                      type="button"
                      onClick={changeVisibility}
                    >
                      {visibility === false ? (
                        <VisibilityOffIcon className="ml-0.5 text-white" />
                      ) : (
                        <VisibilityIcon className="ml-0.5 text-white" />
                      )}
                    </IconButton>
                  </div>

                  {loading ? null : (
                    <button className="color_button text-white font-medium input_letter rounded-md py-1 px-6 hover:border-gray-400">
                      INGRESAR
                    </button>
                  )}
                  {loading ? (
                    <div className="lds-circle">
                      <div></div>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="lds-circle-big">
                  <div></div>
                </div>
              )}
              <div className="flex justify-center">
                <img src={texto} alt="YACHAYHUASI" />
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      </form>
    </div>
  );
};

export default LoginRefactor;
