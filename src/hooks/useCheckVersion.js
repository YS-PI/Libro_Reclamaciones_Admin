import packageJson from "../../package.json";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CheckVersion = () => {
  const version = packageJson.version;
  const navigate = useNavigate();
  const godMode = `${process.env.REACT_APP_GOD_MODE}`;
  //   if (godMode === "true") {
  //     console.log("web version: " + version);
  //     console.log(
  //       "local version: " + JSON.parse(sessionStorage.getItem("version")).version
  //     );
  //   }
  if (JSON.parse(sessionStorage.getItem("version")).version !== version) {
    toast.error("Versión del programa anticuado", { theme: "dark" });

    sessionStorage.clear();
    navigate("/login");
  }
  return [];
};

export default CheckVersion;
