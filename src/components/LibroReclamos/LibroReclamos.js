import React, { useEffect, useRef, useState } from "react";
import "./LibroReclamos.css";
import "./TablaReclamos/TablaReclamos.css";
import { TablePagination } from "@mui/material";
import { AiFillEdit } from "react-icons/ai";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Modal from "../LibroReclamos/modal/Modal";
import ModalPDF from "./modalPDF/ModalPDF.js";
import axios from "axios";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { ToastContainer } from "react-toastify";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { toast } from "react-toastify";
import { BsFillBookmarkFill } from "react-icons/bs";
import {
  useTheme,
  createTheme,
  ThemeProvider,
  styled,
} from "@mui/material/styles";
import usePostRequest from "../../hooks/usePostRequest.js";

export default function LibroReclamos() {
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  }
  const tableRef = useRef(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [filterSaveData1, setFilterSaveData1] = useState([]);
  const [filterSaveData2, setFilterSaveData2] = useState([]);
  const [filterSaveData3, setFilterSaveData3] = useState([]);
  const [searchCode1, setSearchCode1] = useState("");
  const [searchCode2, setSearchCode2] = useState("");
  const [searchCode3, setSearchCode3] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openModalPDF, setOpenModalPDF] = useState(false);
  const [saveData1, setSaveData1] = useState([]);
  const [saveData2, setSaveData2] = useState([]);
  const [saveData3, setSaveData3] = useState([]);
  const [saveCopy, setSaveCopy] = useState([]);
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
    dataTable1();
    dataTable2();
    dataTable3();
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };
  const [saveValue, setSaveValue] = useState([]);
  /* const actualizar = async () => {
    try {
      const url = `${process.env.REACT_APP_URL_LIBRO}formulario/Reclamos_actos_con_respuesta_cambio_estado`;

      const header = {
        "Content-Type": "application/json",
      };

      const body = JSON.stringify({});

      const { data } = await axios(url, {
        method: "POST",
        headers: header,
        data: body,
      });
      toast.success(`Descarga Exitosa`);
      dataTable1();
      setSaveCopy(data);
    } catch (error) {
      toast.success(`ERROR`);
    }
  }; */

  const [actualizar] = usePostRequest(
    // "mantenimiento/aulas/lista",
    `${
      process.env.REACT_APP_URL +
      "formulario/Reclamos_actos_con_respuesta_cambio_estado"
    }`,
    setSaveCopy,
    {},
    () => {
      toast.success(`Descarga Exitosa`);
      dataTable1();
    },
    (error) => {
      toast.error(`ERROR: ${error.message}`);
    }
  );

  //DATA-CON RESPUESTA 2
  const [dataTable1] = usePostRequest(
    // "mantenimiento/aulas/lista",
    `${
      process.env.REACT_APP_URL +
      "formulario/Reclamos_actos_con_respuesta_carga_masiva"
    }`,
    setSaveData1,
    {}
  );
  /* const dataTable1 = async () => {
    const url = `${process.env.REACT_APP_URL_LIBRO}formulario/Reclamos_actos_con_respuesta_carga_masiva`;

    const header = {
      "Content-Type": "application/json",
    };

    const body = JSON.stringify({});

    const { data } = await axios(url, {
      method: "POST",
      headers: header,
      data: body,
    });

    setSaveData1(data);
  }; */

  useEffect(() => {
    dataTable1();
  }, []);

  //DATA-CON RESPUESTA 1
  /* const dataTable2 = async () => {
    const url = `${process.env.REACT_APP_URL_LIBRO}formulario/todos_los_reclamos_faltantes`;

    const header = {
      "Content-Type": "application/json",
    };

    const body = JSON.stringify({});

    const { data } = await axios(url, {
      method: "POST",
      headers: header,
      data: body,
    });

    setSaveData2(data);
  }; */

  const [dataTable2] = usePostRequest(
    `${process.env.REACT_APP_URL}formulario/todos_los_reclamos_faltantes`,
    setSaveData2,
    {}
  );

  useEffect(() => {
    dataTable2();
  }, []);

  //DATA MASIVA 3
  /*  const dataTable3 = async () => {
    const url = `${process.env.REACT_APP_URL_LIBRO}formulario/todos_los_reclamos`;

    const header = {
      "Content-Type": "application/json",
    };

    const body = JSON.stringify({});

    const { data } = await axios(url, {
      method: "POST",
      headers: header,
      data: body,
    });

    setSaveData3(data);
  }; */

  const [dataTable3] = usePostRequest(
    // "mantenimiento/aulas/lista",
    `${process.env.REACT_APP_URL + "formulario/todos_los_reclamos"}`,
    setSaveData3,
    {}
  );

  useEffect(() => {
    dataTable3();
  }, []);

  //FILTRADO 1
  useEffect(() => {
    const filterData1 = saveData1?.filter((data) => {
      const codigoReclamo = data?.NLIRE_CODIGO?.toLowerCase()?.includes(
        searchCode1.toLocaleLowerCase()
      );
      const codigoNombre = data?.CLIRE_NOMBRES?.toLowerCase()?.includes(
        searchCode1.toLocaleLowerCase()
      );
      const codigoRespuesta = data?.CLIRE_RESPUESTA?.toLowerCase()?.includes(
        searchCode1.toLocaleLowerCase()
      );
      const codigoDescripcion =
        data?.CLIRE_DESCRIPCION?.toLowerCase()?.includes(
          searchCode1.toLocaleLowerCase()
        );
      const codigoFecha = data?.DLIRE_FECHA_RESPUESTA?.toLowerCase()?.includes(
        searchCode1.toLocaleLowerCase()
      );
      return (
        codigoReclamo ||
        codigoNombre ||
        codigoRespuesta ||
        codigoDescripcion ||
        codigoFecha
      );
    });
    setFilterSaveData1(filterData1);
  }, [searchCode1, saveData1]);

  //FILTRADO 2
  useEffect(() => {
    const filterData2 = saveData2.filter((data) => {
      const codigoReclamo = data?.NLIRE_CODIGO?.toLowerCase()?.includes(
        searchCode2?.toLocaleLowerCase()
      );
      const codigoNombre = data?.CLIRE_NOMBRES?.toLowerCase()?.includes(
        searchCode2?.toLocaleLowerCase()
      );
      const codigoRespuesta = data?.CLIRE_RESPUESTA?.toLowerCase()?.includes(
        searchCode2?.toLocaleLowerCase()
      );
      const codigoDescripcion =
        data?.CLIRE_DESCRIPCION?.toLowerCase()?.includes(
          searchCode2?.toLocaleLowerCase()
        );
      const codigoFecha = data?.DLIRE_FECHA?.toLowerCase()?.includes(
        searchCode2?.toLocaleLowerCase()
      );
      return (
        codigoReclamo ||
        codigoNombre ||
        codigoRespuesta ||
        codigoDescripcion ||
        codigoFecha
      );
    });
    setFilterSaveData2(filterData2);
  }, [searchCode2, saveData2]);

  //FILTRADO 3
  useEffect(() => {
    const filterData3 = saveData3?.filter((data) => {
      const codigoReclamo = data?.NLIRE_CODIGO?.toLowerCase()?.includes(
        searchCode3.toLocaleLowerCase()
      );
      const codigoNombre = data?.CLIRE_NOMBRES?.toLowerCase()?.includes(
        searchCode3.toLocaleLowerCase()
      );
      const codigoRespuesta = data?.CLIRE_RESPUESTA?.toLowerCase()?.includes(
        searchCode3.toLocaleLowerCase()
      );
      const codigoDescripcion =
        data?.CLIRE_DESCRIPCION?.toLowerCase()?.includes(
          searchCode3.toLocaleLowerCase()
        );
      const codigoFecha = data?.DLIRE_FECHA_RESPUESTA?.toLowerCase()?.includes(
        searchCode3.toLocaleLowerCase()
      );
      const codigoEnviado = data?.NLIRE_VALIDACION?.toLowerCase()?.includes(
        searchCode3.toLocaleLowerCase()
      );
      return (
        codigoReclamo ||
        codigoNombre ||
        codigoRespuesta ||
        codigoDescripcion ||
        codigoFecha ||
        codigoEnviado
      );
    });
    setFilterSaveData3(filterData3);
  }, [searchCode3, saveData3]);

  useEffect(() => {
    window.parent.postMessage({ location: "libroreclamo" }, "*");
    window.addEventListener("message", (e) => {
      var data = e.data;
    });
  }, [filterSaveData1]);

  let theme = useTheme();
  theme = createTheme(theme, {
    components: {
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: "rgba(15,76,52)",
          },
        },
      },

      MuiTab: {
        styleOverrides: {
          root: {
            color: "rgba(164,168,178)",
            fontWeight: "bold",
            "&:hover": {
              color: "rgba(15,76,52)",
              fontWeight: "bold",
            },
            "&.Mui-selected": {
              color: "rgba(15,76,52)",
              fontWeight: "bold",
            },
            "&.Mui-disabled": {
              color: "rgba(51,49,50)",
              fontWeight: "bold",
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="BG_general ">
        <div
          //className="w-full px-10"
          className="w-full px-10 grid place-items-start bg-cover"
        >
          <div className="w-full mt-9 grid items-start reclamo__container bg-gray-50 border border-gray-400 rounded-lg">
            <Box sx={{ width: "100%", typography: "body1", overflowX: "auto" }}>
              <TabContext value={value} sx={{ overflowX: "auto" }}>
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    overflowX: "auto",
                  }}
                >
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                    variant="scrollable"
                  >
                    <Tab label="Reclamos No Atendidos" value="1" />
                    <Tab label="Reclamos Atendidos / Descargar URL" value="2" />
                    <Tab label="Todos los Reclamos" value="3" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <div className="w-full">
                    <label className="block mb-2 text-sm font font-sans font-semibold text-gray-800">
                      Buscar por Código/ Nombre/ Descripción/ Respuesta/ Fecha
                    </label>
                    <input
                      type="text"
                      value={searchCode2}
                      onChange={(e) => {
                        setSearchCode2(e.target.value);
                        setPage(0);
                      }}
                      className="outline-none bg-gray-50 border hover:border-green-700 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-700 focus:border-green-700 block w-full p-2 light:bg-green-700 light:border-green-600 light:placeholder-green-400 light:text-white light:focus:ring-green-500 light:focus:border-green-500"
                      placeholder="Nro-00000000U-LR-URP o Nombre del Reclamante"
                    />
                  </div>
                  <div className="flex justify-start w-full py-4 caja gap-4">
                    <label className="flex text-yellow-500 font-bold leyenda tracking-tight">
                      <BsFillBookmarkFill className="mt-1 " />{" "}
                      <p>Pendiente: Más de 5 días para responder.</p>
                    </label>
                    <label className="flex text-red-600 font-bold leyenda tracking-tight">
                      <BsFillBookmarkFill className="mt-1 " />{" "}
                      <p>Por Caducar: Menos de 5 días para responder.</p>
                    </label>
                  </div>
                  <div className="justify-center overflow-x-auto bg-gray-50 border-gray-800 rounded-lg">
                    <table className="text-sm text-center text-gray-500  w-full border-solid ">
                      <thead className="text-xs font-sans  bg-gray-800 text-white whitespace-nowrap uppercase">
                        <tr>
                          <th scope="col" className="px-6 py-2">
                            CÓDIGO DE RECLAMO
                          </th>
                          <th scope="col" className="px-6 py-2">
                            NOMBRE COMPLETO
                          </th>
                          <th scope="col" className="px-6 py-2 ">
                            FECHA DE CREACIÓN
                          </th>
                          <th scope="col" className="px-6 py-2 ">
                            DESCRIPCIÓN
                          </th>
                          <th scope="col" className="px-6 py-2 ">
                            TELÉFONO
                          </th>
                          <th scope="col" className="px-6 py-2 ">
                            <h3>ESTADO</h3>
                          </th>
                          <th scope="col" className="px-6 py-2 ">
                            PDF
                          </th>
                          <th scope="col" className="px-6 py-2 ">
                            ATENDER
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filterSaveData2
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((resp, index) => (
                            <tr
                              key={index}
                              className="bg-white border-b hover:bg-gray-50 "
                            >
                              <th
                                scope="row"
                                className="px-6 border  font-sans font-semibold text-gray-800 whitespace-nowrap py-2"
                              >
                                {resp.CLIRE_NRORECLAMO}
                              </th>
                              <td className="border font-normal py-2">{`${resp.CLIRE_NOMBRES} ${resp.CLIRE_APEPATERNO} ${resp.CLIRE_APEMATERNO}`}</td>
                              <td className="px-6 font-normal border py-2">
                                {resp.DLIRE_FECHA}
                              </td>
                              <td className="px-4 font-normal border py-2">
                                {truncateText(
                                  resp.CLIRE_DESCRIPCION.toLowerCase(),
                                  20
                                )}
                              </td>
                              <td className="px-6 font-normal border py-2">
                                {resp.CLIRE_TELEFONO}
                              </td>
                              <th className="font-normal px-2 border py-2">
                                <td
                                  className={
                                    resp.ESTADO === "POR CADUCAR"
                                      ? "flex ml-3 justify-start text-red-500 font-bold"
                                      : "flex ml-3 justify-start text-yellow-500 font-bold"
                                  }
                                >
                                  <BsFillBookmarkFill className="mt-1 mr-1" />
                                  {resp.ESTADO === "POR CADUCAR"
                                    ? `${resp.TIEMPO_RESTANTE} días restantes`
                                    : `${resp.TIEMPO_RESTANTE} días restantes`}
                                </td>
                              </th>
                              <th className="px-6 border py-2">
                                <button
                                  className="flex justify-center w-full items-center hover:text-green-700"
                                  onClick={() => {
                                    setSaveValue(resp);
                                    setOpenModalPDF(true);
                                  }}
                                >
                                  <PictureAsPdfIcon />
                                </button>
                              </th>
                              <th className="px-6  border py-2">
                                <button
                                  className="flex justify-center w-full items-center hover:text-green-700"
                                  onClick={() => {
                                    setSaveValue(resp);
                                    setOpenModal(true);
                                  }}
                                >
                                  <AiFillEdit />
                                </button>
                              </th>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    <TablePagination
                      sx={{ mt: 2 }}
                      rowsPerPageOptions={[5, 10, 15, 20, 100]}
                      component="div"
                      count={filterSaveData2.length}
                      rowsPerPage={rowsPerPage}
                      labelRowsPerPage="Número de Filas:"
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </div>
                </TabPanel>
                <TabPanel value="2">
                  <div className="grid grid-cols-2 justify-between w-full  gap-4 ajuste_button">
                    <div className="w-full pb-6 dif">
                      <label className="block mb-2 text-sm font-sans font-semibold text-gray-800 light:text-white">
                        Buscar por Código/ Nombre/ Descripción/ Respuesta/ Fecha
                      </label>
                      <input
                        type="text"
                        value={searchCode1}
                        onChange={(e) => {
                          setSearchCode1(e.target.value);
                          setPage(0);
                        }}
                        className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg hover:border-green-700 focus:ring-green-600 focus:border-green-700 block w-full p-2 light:bg-green-700 light:border-green-600 light:placeholder-green-400 light:text-white light:focus:ring-green-500 light:focus:border-green-500"
                        placeholder="Nro-00000000U-LR-URP o Nombre del Reclamante"
                      />
                    </div>
                    <div className="w-full grid justify-end gap-4 ajuste_excel">
                      <div className="grid pb-6 ajuste_excel">
                        <label className=" text-sm font-sans font-bold text-gray-900 light:text-white pb-2">
                          Descargar Formato INDECOPI
                        </label>
                        <DownloadTableExcel
                          filename="Reclamos masivos"
                          sheet="Indecopi"
                          currentTableRef={tableRef.current}
                        >
                          <button
                            className="outline-none border border-gray-300 text-sm rounded-lg py-2.5  w-full  bg-green-700 block font-bold text-white light:text-white hover:scale-105"
                            onClick={() => {
                              // print(tableRef.current);
                              actualizar();
                            }}
                          >
                            Descargar Excel
                          </button>
                        </DownloadTableExcel>
                      </div>
                    </div>
                  </div>
                  {/* DESCARGA MASIVA EN EXCEL - FORMATO INDECOPI */}
                  <table className="hidden text-gray-500 " ref={tableRef}>
                    <tbody>
                      {filterSaveData1.map((resp, index) => (
                        <tr key={index}>{resp?.FORMAT_INDECOPI}</tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="justify-center overflow-x-auto bg-gray-50 border-gray-800 rounded-lg">
                    <table className="text-sm text-center text-gray-600  w-full border-solid ">
                      <thead className="text-xs font-sans font-bold  bg-gray-800 text-white  uppercase ">
                        <tr>
                          <th scope="col" className="px-6 py-2 font-sans">
                            CÓDIGO DE RECLAMO
                          </th>
                          <th scope="col" className="px-6 py-2 font-sans">
                            NOMBRE COMPLETO
                          </th>
                          <th scope="col" className="px-6 py-2 font-sans">
                            FECHA DE ATENCIÓN
                          </th>
                          <th scope="col" className="px-6 py-2 font-sans">
                            DESCRIPCIÓN
                          </th>
                          <th scope="col" className="px-6 py-2 font-sans">
                            RESPUESTA
                          </th>
                          <th scope="col" className="px-6 py-2 font-sans">
                            PDF
                          </th>
                          <th scope="col" className="px-6 py-2 font-sans">
                            EDITAR
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filterSaveData1
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((resp, index) => (
                            <tr
                              key={index}
                              className="bg-white border-b  hover:bg-gray-50"
                            >
                              <th
                                scope="row"
                                className="text-start px-6 font-sans font-semibold text-gray-800 whitespace-nowrap border py-2"
                                disabled
                              >
                                {resp.CLIRE_NRORECLAMO}
                              </th>
                              <td className="px-6 font-normal border text-start py-2">{`${resp.CLIRE_NOMBRES} ${resp.CLIRE_APEPATERNO} ${resp.CLIRE_APEMATERNO}`}</td>
                              <td className="px-6 border font-normal text-justify py-2">
                                {resp.DLIRE_FECHA_RESPUESTA}
                              </td>
                              <th className="px-4 font-normal border text-justify py-2">
                                {truncateText(
                                  resp.CLIRE_DESCRIPCION.toLowerCase(),
                                  20
                                )}
                              </th>
                              <th className="px-6 font-normal border text-justify py-2">
                                {truncateText(
                                  resp.CLIRE_RESPUESTA.toLowerCase(),
                                  20
                                )}
                              </th>
                              <th className=" px-6 border py-2">
                                <button
                                  className="flex justify-center w-full items-center hover:text-green-700"
                                  onClick={() => {
                                    setSaveValue(resp);
                                    setOpenModalPDF(true);
                                  }}
                                >
                                  <PictureAsPdfIcon />
                                </button>
                              </th>
                              <th className="px-6 border py-2">
                                <button
                                  className="flex justify-center w-full items-center hover:text-green-700"
                                  onClick={() => {
                                    setSaveValue(resp);
                                    setOpenModal(true);
                                  }}
                                >
                                  <AiFillEdit />
                                </button>
                              </th>
                            </tr>
                          ))}
                      </tbody>
                    </table>

                    <TablePagination
                      sx={{ mt: 2 }}
                      rowsPerPageOptions={[5, 10, 15, 20, 100]}
                      component="div"
                      count={filterSaveData1.length}
                      rowsPerPage={rowsPerPage}
                      labelRowsPerPage="Número de Filas:"
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </div>
                </TabPanel>
                <TabPanel value="3">
                  <div className="w-full pb-6">
                    <label className="block mb-2 text-sm font-sans font-semibold text-gray-800 light:text-white">
                      Buscar por Código/ Nombre/ Descripción/ Respuesta/ Fecha/
                      Envío
                    </label>
                    <input
                      type="text"
                      value={searchCode3}
                      onChange={(e) => {
                        setSearchCode3(e.target.value);
                        setPage(0);
                      }}
                      className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg hover:border-green-700 focus:ring-green-600 focus:border-green-700 block w-full p-2 light:bg-green-700 light:border-green-600 light:placeholder-green-400 light:text-white light:focus:ring-green-500 light:focus:border-green-500"
                      placeholder="Nro-00000000U-LR-URP o Nombre del Reclamante"
                    />
                  </div>
                  <div className="justify-center overflow-x-auto bg-gray-50 border-gray-800 rounded-lg">
                    <table className="text-sm text-center text-gray-600  w-full border-solid ">
                      <thead className="text-xs font-sans font-bold bg-gray-800 text-white uppercase border-solid">
                        <tr>
                          <th scope="col" className="px-6 py-2">
                            CÓDIGO DE RECLAMO
                          </th>
                          <th scope="col" className="px-6 py-2">
                            NOMBRE COMPLETO
                          </th>
                          <th scope="col" className="px-6 py-2">
                            FECHA DE CREACIÓN
                          </th>
                          <th scope="col" className="px-6 py-2">
                            FECHA DE ATENCIÓN
                          </th>
                          <th scope="col" className="px-6 py-2">
                            DESCRIPCIÓN
                          </th>
                          <th scope="col" className="px-6 py-2">
                            RESPUESTA
                          </th>
                          <th scope="col" className="px-6 py-2 ">
                            PDF
                          </th>
                          <th scope="col" className="px-6 py-2">
                            ¿URL GENERADA?
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filterSaveData3
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((resp, index) => (
                            <tr
                              key={index}
                              className="bg-white border-b hover:bg-gray-50 "
                            >
                              <th
                                scope="row"
                                className="text-start px-6 font-sans font-semibold text-gray-800 whitespace-nowrap border py-2"
                              >
                                {resp.CLIRE_NRORECLAMO}
                              </th>
                              <th className="px-6 border font-normal text-start py-2">{`${resp.CLIRE_NOMBRES}  ${resp.CLIRE_APEPATERNO} ${resp.CLIRE_APEMATERNO}`}</th>
                              <th className="px-6 border font-normal py-2">
                                {resp.DLIRE_FECHA}
                              </th>
                              <th className="px-6 border font-normal py-2">
                                {resp.DLIRE_FECHA_RESPUESTA}
                              </th>
                              <th className="px-6 border font-normal text-start py-2">
                                {truncateText(
                                  resp.CLIRE_DESCRIPCION.toLowerCase(),
                                  20
                                )}
                              </th>
                              <th className="px-6 border font-normal  text-start py-2">
                                {truncateText(
                                  resp.CLIRE_RESPUESTA.toLowerCase(),
                                  20
                                )}
                              </th>
                              <th className="px-6 border py-2">
                                <button
                                  className="flex justify-center w-full items-center hover:text-green-700"
                                  onClick={() => {
                                    setSaveValue(resp);
                                    setOpenModalPDF(true);
                                  }}
                                >
                                  <PictureAsPdfIcon />
                                </button>
                              </th>
                              <th className="px-6 border font-normal py-2">
                                {resp.NLIRE_VALIDACION}
                              </th>
                            </tr>
                          ))}
                      </tbody>
                    </table>

                    <TablePagination
                      sx={{ mt: 2 }}
                      rowsPerPageOptions={[5, 10, 15, 20, 100]}
                      component="div"
                      count={filterSaveData3.length}
                      rowsPerPage={rowsPerPage}
                      labelRowsPerPage="Número de Filas:"
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </div>
                </TabPanel>
              </TabContext>
            </Box>
          </div>

          {openModal ? (
            <Modal
              openModal={openModal}
              setOpenModal={setOpenModal}
              saveValue={saveValue}
              dataTable2={dataTable2}
            />
          ) : null}
          {openModalPDF ? (
            <ModalPDF
              openModalPDF={openModalPDF}
              setOpenModalPDF={setOpenModalPDF}
              saveValue={saveValue}
            />
          ) : null}
          <ToastContainer />
        </div>
      </div>
    </ThemeProvider>
  );
}
