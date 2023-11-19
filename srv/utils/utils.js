/* eslint-disable no-console */
/**
 * @description Función para obtener el error
 * @creation Guillermo Eduardo Narvaez Muggi 17/11/2023
 * @update
 */

async function sendResponse(idtransaccion, code, message, oDataResponse) {
    let oResponse = {};
    oResponse.oAuditResponse = {};
    oResponse.oAuditResponse.idtransaccion = idtransaccion;
    oResponse.oAuditResponse.code = code;
    oResponse.oAuditResponse.message = message;
    oResponse.oDataResponse = oDataResponse;
    return oResponse;
  }
  
  /**
   * @description Función para obtener el error
   * @creation Guillermo Eduardo Narvaez Muggi 17/11/2023
   * @update
   */
  async function customError(error, code) {
    let oError = {};
    if (error.name === 'Error') {
      const sErrorMensaje = error.message.split('||');
      if (sErrorMensaje.length > 1) {
        oError.code = parseInt(sErrorMensaje[0], 10);
        oError.message = sErrorMensaje[1];
      } else {
        oError.code = -1;
        oError.message = sErrorMensaje[0];
      }
    } else {
      let sErrorMensaje = 'Sin ubicación';
      if (error.stack !== undefined) {
        sErrorMensaje = error.stack;
      }
      oError.code = code;
      oError.message = sErrorMensaje;
    }
  
    return oError;
  }
  
  /**
   * @description Función para obtener formato de fecha segun formato: dd/mm/yyyy ---- dd/mm/yyyy h:m:s
   * @creation David Villanueva 09/08/2020
   * @update
   */
  async function formatDate(date, format) {
    let nuevoFormat = '';
    if (date !== undefined && date !== null) {
      if (date.getFullYear() !== -1) {
        let dd = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate();
        let mm = date.getMonth() + 1 <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        let yyyy = date.getFullYear();
        let hour = date.getHours() <= 9 ? '0' + date.getHours() : date.getHours();
        let minut = date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes();
        let segund = date.getSeconds() <= 9 ? '0' + date.getSeconds() : date.getSeconds();
        nuevoFormat = format
          .replace('dd', dd)
          .replace('mm', mm)
          .replace('yyyy', yyyy)
          .replace('h', hour)
          .replace('m', minut)
          .replace('s', segund);
      }
    }
    return nuevoFormat;
  }
  
  /**
   * @description Función para obtener formato de fecha segun formato: dd/mm/yyyy ---- dd/mm/yyyy h:m:s
   * @creation David Villanueva 09/08/2020
   * @update
   */
  async function generarDate(fecha) {
    let nuevaFecha = '';
    if (fecha === undefined || fecha === null || fecha === '') {
      let iTiempoServidor = -5;
      let FechaInicio = new Date();
      FechaInicio.setHours(FechaInicio.getHours() + iTiempoServidor);
      nuevaFecha = await formatDate(FechaInicio, 'yyyy-mm-ddTh:m:sZ');
    } else {
      nuevaFecha = fecha;
    }
    return nuevaFecha;
  }
  
  /**
   * @description Función para validar los parametros de auditoria enviados en el request al llamar los xsjs
   * @creation David Villanueva 08/08/2020
   * @update
   */
  async function validarAuditRequest(oHeader) {
    let oResponse = {};
    try {
      oResponse.code = 1;
      oResponse.message = 'OK';
      if (!oHeader['idtransaccion']) {
        oResponse.code = 200;
        oResponse.message = 'Falta datos de Auditoria: Idtransaccion';
        return oResponse;
      }
      if (!oHeader['aplicacion']) {
        oResponse.code = 201;
        oResponse.message = 'Falta datos de Auditoria: Aplicacion';
        return oResponse;
      }
      if (!oHeader['terminal']) {
        oResponse.code = 203;
        oResponse.message = 'Falta datos de Auditoria: Terminal';
        return oResponse;
      }
      if (!oHeader['usuario']) {
        oResponse.code = 203;
        oResponse.message = 'Falta datos de Auditoria: Usuario';
        return oResponse;
      }
      oResponse.oDataResponse = {};
      oResponse.oDataResponse.idtransaccion = oHeader['idtransaccion'];
      oResponse.oDataResponse.aplicacion = oHeader['aplicacion'];
      oResponse.oDataResponse.usuario = oHeader['usuario'];
      oResponse.oDataResponse.terminal = oHeader['terminal'];
      oResponse.oDataResponse.fecha = await generarDate();
  
      if (oHeader['infousuario']) {
        oResponse.oDataResponse.infousuario = JSON.parse(oHeader['infousuario']);
      }
    } catch (error) {
      console.log('error', error);
      oResponse.code = -2;
      oResponse.message = 'error middleware: ' + error.message;
    }
    return oResponse;
  }
  
  /**
   * @description Función para convertir valores vacios en 0
   * @creation David Villanueva 09/08/2020
   * @update
   */
  async function convertEmptyToZero(value) {
    if (isNaN(value)) {
      value = 0;
    } else {
      value = parseInt(value, 10);
    }
    return value;
  }
  
  /**
   * @description Función para generar codigos personalizados
   * @creation David Villanueva 10/08/2020
   * @update
   */
  async function generarCodigo(Id, cantidad, valorInicial) {
    let pad = '';
    for (let i = 0; i < cantidad; i++) {
      pad = '0' + pad;
    }
    let n = Id;
    let codigo = valorInicial + (pad + n).slice(-pad.length);
  
    return codigo;
  }
  
  /**
   * @description Función para convertir valores undefined a vacios
   * @creation David Villanueva 10/08/2020
   * @update
   */
  async function convertEmptyToVacio(value) {
    try {
      if (!value) {
        value = '';
      } else {
        value = value.trim();
        /*
                if(value!=""){
                    value =	decodeURIComponent(escape(value))
                }
                */
      }
      return value;
    } catch (e) {
      return value;
    }
  }
  
  /**
   * @description Función para convertir valores vacios en 0
   * @creation David Villanueva 09/08/2020
   * @update
   */
  async function convertEmptyToZeroFloat(value) {
    if (isNaN(value)) {
      value = 0;
    } else {
      // eslint-disable-next-line no-self-assign
      value = value;
    }
    return value;
  }
  /**
   * @description Función para validar si existe valor del campo
   * @creation David Villanueva 10/08/2020
   * @update
   */
  async function existeValorCampo(value) {
    let existe = true;
    if (value === undefined) {
      existe = false;
    }
    if (value === null) {
      existe = false;
    }
    if (value === '') {
      existe = false;
    }
    return existe;
  }
  
  /**
   * @description Función para validar si existe valor del campo y es numerico
   * @creation David Villanueva 10/08/2020
   * @update
   */
  async function existeValorCampoNumero(value) {
    let existe = true;
    if (value === undefined) {
      existe = false;
    }
    if (value === null) {
      existe = false;
    }
    if (value === '') {
      existe = false;
    }
  
    if (existe) {
      if (isNaN(parseInt(value, 0))) {
        existe = false;
      }
    }
  
    return existe;
  }
  
  /**
   * @description Función para tildes y caracteres
   * @creation David Villanueva 18/08/2020
   * @update
   */
  async function utf8_decode(utftext) {
    let string = '';
    let i = 0;
    let c = 0;
    let c2 = 0;
    let c3 = 0;
  
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
  
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
  
    return string;
  }
  
  async function utf8_encode(string) {
    string = string.replace(/\r\n/g, '\n');
    let utftext = '';
    for (let n = 0; n < string.length; n++) {
      let c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }
  
  async function filterParamBD(params) {
    //TIENE MAS PARAMETROS
    let modData = {};
    let aFilter = [];
    let filtroString = '';
    let modParam = params;
    let flag = false;
    if (modParam) {
      if (modParam.length > 0) {
        modParam.forEach(function (item, x) {
          ////INICIO ROY
          //////INICIO FILTRO
          flag = false;
          if (item.Type == 'Multi') {
            if (item.operator1 && item.operator2 && item.value1 && item.value2) {
              flag = true;
            }
          } else if (item.Type == 'MultiLike') {
            if (
              (item.key || item.aKey) &&
              item.aValue &&
              (item.aValue !== '' || item.aValue !== "''") &&
              item.operator
            ) {
              item.aValue = item.aValue.filter(function (obj, index) {
                return item.aValue.indexOf(obj) === index && obj;
              });
              if (item.aValue.length > 0) {
                flag = true;
              }
            }
          } else {
            if (
              item.key &&
              item.value &&
              (item.value !== '' || item.value !== "''") &&
              item.operator
            ) {
              flag = true;
            }
            if (
              item.key &&
              item.aValue &&
              (item.aValue !== '' || item.aValue !== "''") &&
              item.operator
            ) {
              item.aValue = item.aValue.filter(function (obj, index) {
                if (item.operator == 'BETWEEN') {
                  return obj !== '';
                } else {
                  return item.aValue.indexOf(obj) === index && obj;
                }
              });
              if (item.aValue.length > 0) {
                flag = true;
              }
            }
          }
          //////END FILTRO
          if (flag) {
            ////INICIO ASIGNAR ESTRUCTURA DE CONSULTA DEPENDIENDO AL OPERADOR
            if (item.operator == 'IN' || item.operator == 'NOT IN') {
              let interrogacion = '(';
              if (item.aValue.length > 0) {
                item.aValue.forEach(function (itemX, x) {
                  if (itemX) {
                    if (x === 0) {
                      interrogacion = interrogacion + '?';
                    } else {
                      interrogacion = interrogacion + ',?';
                    }
                  }
                });
              }
              interrogacion = interrogacion + ')';
              item.sInterrogacion = interrogacion.includes('?') ? interrogacion : null;
            } else if (item.operator == 'BETWEEN') {
              let interrogacion = ' ? AND ? ';
              item.sInterrogacion = interrogacion.includes('?') ? interrogacion : null;
            }
            ////END ASIGNAR ESTRUCTURA DE CONSULTA DEPENDIENDO AL OPERADOR
            ////INICIO CLASIFICACION SEGUN TIPO DE ESTRUCTURA;
            if (item.Type == 'Multi') {
              let conditionGlobal = item.conditionGlobal ? item.conditionGlobal : 'AND';
              let condition = item.condition ? item.condition : 'AND';
              let parentAnt = '';
              if (item.parentAnt) {
                parentAnt = parentAnt + item.parentAnt;
              }
              let parentPost = '';
              if (item.parentPost) {
                parentPost = parentPost + item.parentPost;
              }
              if (x == 0) {
                filtroString =
                  filtroString +
                  ' ' +
                  conditionGlobal +
                  ' ' +
                  parentAnt +
                  ' "' +
                  item.key1 +
                  '"  ' +
                  item.operator1 +
                  '  ?  ' +
                  condition +
                  ' "' +
                  item.key2 +
                  '"  ' +
                  item.operator2 +
                  '  ? ' +
                  parentPost +
                  ' ';
              } else {
                conditionGlobal = item.conditionGlobal ? item.conditionGlobal : 'OR';
                filtroString =
                  filtroString +
                  ' ' +
                  conditionGlobal +
                  ' ' +
                  parentAnt +
                  ' "' +
                  item.key1 +
                  '"  ' +
                  item.operator1 +
                  '  ?  ' +
                  condition +
                  ' "' +
                  item.key2 +
                  '"  ' +
                  item.operator2 +
                  '  ? ' +
                  parentPost +
                  ' ';
              }
              aFilter.push(item.value1);
              aFilter.push(item.value2);
            } else if (item.Type == 'MultiLike') {
              if (item.operator === 'LIKE' || item.operator === 'NOT LIKE') {
                if (item.aValue) {
                  if (item.aValue.length > 0) {
                    item.aValue.forEach(function (idValue, position) {
                      if (idValue) {
                        let condition =
                          position == 0 ? (item.condition ? item.condition : 'AND') : 'OR';
                        let parentAnt = position == 0 ? ' (' : '';
                        let parentPost = item.aValue.length - 1 == position ? ' )' : '';
                        let interrogacion = '?';
                        filtroString =
                          filtroString +
                          ' ' +
                          condition +
                          parentAnt +
                          ' "' +
                          (item.key ? item.key : item.aKey[position]) +
                          '" ' +
                          item.operator +
                          ' ' +
                          interrogacion +
                          parentPost +
                          ' ';
                        aFilter.push(idValue);
                      }
                    });
                  }
                }
              }
            } else {
              let parentAnt = '';
              if (item.parentAnt) {
                parentAnt = parentAnt + item.parentAnt;
              }
              let parentPost = '';
              if (item.parentPost) {
                parentPost = parentPost + item.parentPost;
              }
              let condition = item.condition ? item.condition : 'AND';
              if (item.operator === 'IN' || item.operator === 'NOT IN') {
                filtroString =
                  filtroString +
                  ' ' +
                  condition +
                  ' ' +
                  parentAnt +
                  ' "' +
                  item.key +
                  '" ' +
                  item.operator +
                  ' ' +
                  item.sInterrogacion +
                  ' ' +
                  parentPost +
                  ' ';
                if (item.aValue) {
                  if (item.aValue.length > 0) {
                    item.aValue.forEach(function (idValue) {
                      aFilter.push(idValue);
                    });
                  }
                }
              } else if (item.operator === 'BETWEEN') {
                filtroString =
                  filtroString +
                  ' ' +
                  condition +
                  ' ' +
                  parentAnt +
                  ' "' +
                  item.key +
                  '" ' +
                  item.operator +
                  ' ' +
                  item.sInterrogacion +
                  ' ' +
                  parentPost +
                  ' ';
                if (item.aValue) {
                  if (item.aValue.length > 0) {
                    item.aValue.forEach(function (idValue) {
                      aFilter.push(idValue);
                    });
                  }
                }
              } else {
                filtroString =
                  filtroString +
                  ' ' +
                  condition +
                  ' ' +
                  parentAnt +
                  ' "' +
                  item.key +
                  '" ' +
                  item.operator +
                  ' ' +
                  parentPost +
                  ' ?';
                if (item.value) {
                  aFilter.push(item.value);
                }
              }
            }
            ////END CLASIFICACION SEGUN TIPO DE ESTRUCTURA;
          }
          ////END ROY
        });
      }
    }
    modData.aFilter = aFilter;
    modData.sFilter = filtroString;
    return modData;
  }
  
  async function decodeBase64(base64, fallback) {
    let text = fallback;
  
    if (!base64 || base64 === '') {
      text = fallback;
    } else {
      try {
        // eslint-disable-next-line no-undef
        let arrayBuffer = $.util.codec.decodeBase64(base64);
        text = decodeUtf8(arrayBuffer);
      } catch (ex) {
        console.log('error base64 ' + base64);
      }
    }
  
    return text;
  }
  
  async function decodeUtf8(arrayBuffer) {
    let result = '';
    let i = 0;
    let c = 0;
    let c3 = 0;
    let c2 = 0;
  
    let data = new Uint8Array(arrayBuffer);
  
    if (data.length >= 3 && data[0] === 0xef && data[1] === 0xbb && data[2] === 0xbf) {
      i = 3;
    }
  
    while (i < data.length) {
      c = data[i];
  
      if (c < 128) {
        result += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        if (i + 1 >= data.length) {
          throw 'UTF-8 Decode failed. Two byte character was truncated.';
        }
        c2 = data[i + 1];
        result += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        if (i + 2 >= data.length) {
          throw 'UTF-8 Decode failed. Multi byte character was truncated.';
        }
        c2 = data[i + 1];
        c3 = data[i + 2];
        result += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return result;
  }
  
  /**
   * @description Función para validar los parametros de auditoria enviados en el request al llamar los xsjs
   * @creation David Villanueva 08/08/2020
   * @update
   */
  async function mensajeRangoFecha(sFechaInicio, sFechaFin) {
    let oResponse = '';
    try {
      oResponse = sFechaInicio.split(' ')[0] + ' - ' + sFechaFin.split(' ')[0];
    } catch (error) {
      console.log(error);
      oResponse = '';
    }
  
    return oResponse;
  }
  /**
   * @description Función para devoler el objeto de entrada
   * @creation David Villanueva 01/12/2020
   * @update
   */
  async function customRequest(oRequest) {
    let oResponse = {};
    oResponse.oAuditRequest = {};
    oResponse.oAuditRequest.usuario = oRequest.headers.usuario;
    if (oRequest.headers.fecha !== undefined) {
      oResponse.oAuditRequest.fecha = oRequest.headers.fecha;
    } else {
      oResponse.oAuditRequest.fecha = await generarDate();
    }
    oResponse.oAuditRequest.terminal = oRequest.headers.terminal;
    oResponse.oAuditRequest.idtransaccion = oRequest.headers.idtransaccion;
    oResponse.oAuditRequest.aplicacion = oRequest.headers.aplicacion;
    oResponse.oDataResponse = oRequest.body;
  
    oResponse.oFiltro = {};
    if (oRequest.query) {
      oResponse.oFiltro = oRequest.query;
    }
  
    if (oRequest.headers.infousuario) {
      oResponse.oAuditRequest.infousuario = JSON.parse(oRequest.headers.infousuario);
    } else {
      oResponse.oAuditRequest.infousuario = {};
    }
  
    return oResponse;
  }
  async function obtenerFechasHistorico(iNumMeses) {
    let oResponse = {};
    try {
      //Fecha  inicio
      let dateHistorico = new Date();
      dateHistorico.setMonth(dateHistorico.getMonth() - iNumMeses);
      const dd =
        dateHistorico.getDate() <= 9 ? '0' + dateHistorico.getDate() : dateHistorico.getDate();
      const mm =
        dateHistorico.getMonth() + 1 <= 9
          ? '0' + (dateHistorico.getMonth() + 1)
          : dateHistorico.getMonth() + 1;
      const yyyy = dateHistorico.getFullYear();
      oResponse.sFechaInicio = yyyy + '-' + mm + '-' + dd + ' 00:00:00';
      //Fecha  Fin
      let dateFinHistorico = new Date();
      const dd2 =
        dateFinHistorico.getDate() <= 9
          ? '0' + dateFinHistorico.getDate()
          : dateFinHistorico.getDate();
      const mm2 =
        dateFinHistorico.getMonth() + 1 <= 9
          ? '0' + (dateFinHistorico.getMonth() + 1)
          : dateFinHistorico.getMonth() + 1;
      const yyyy2 = dateFinHistorico.getFullYear();
      oResponse.sFechaFin = yyyy2 + '-' + mm2 + '-' + dd2 + ' 23:59:59';
    } catch (error) {
      console.log(error);
    }
    return oResponse;
  }
  
  async function obtenetNumDiasEntreFechas(f1, f2) {
    const aFecha1 = f1.split('/');
    const aFecha2 = f2.split('/');
    const fFecha1 = Date.UTC(aFecha1[2], aFecha1[1] - 1, aFecha1[0]);
    const fFecha2 = Date.UTC(aFecha2[2], aFecha2[1] - 1, aFecha2[0]);
    const dif = fFecha2 - fFecha1;
    const dias = Math.floor(dif / (1000 * 60 * 60 * 24)) + 1;
    return dias;
  }
  
  async function sumarDiaFecha(f1, numDias) {
    //la fecha
    let TuFecha = new Date(f1);
    //dias a sumar
    const dias = parseInt(numDias);
    //nueva fecha sumada
    TuFecha.setDate(TuFecha.getDate() + dias);
    //formato de salida para la fecha
    return TuFecha;
  }
  
  async function validarCruceHorario(FIQ1, FFQ1, FI1, FF1) {
    const fechaQueryInicio = new Date(FIQ1);
    const fechaQueryFin = new Date(FFQ1);
    const fechainicio = new Date(FI1);
    const fechaFin = new Date(FF1);
    const condicion1 = fechaQueryInicio >= fechainicio;
    const condicion2 = fechaQueryInicio >= fechaFin;
    const condicion3 = fechaQueryFin >= fechainicio;
    const condicion4 = fechaQueryFin >= fechaQueryFin;
    let existeCruce = false;
    if (condicion1 === false && condicion2 === false && condicion3 === true && condicion4 === true) {
      existeCruce = true;
    }
    if (condicion1 === true && condicion2 === false) {
      existeCruce = true;
    }
    if (condicion1 === false && condicion2 === false && condicion3 === true) {
      existeCruce = true;
    }
    return existeCruce;
  }
  
  async function validarCruceHorarioActivar(FIQ1, FFQ1, FI1, FF1) {
    const fechaQueryInicio = new Date(FIQ1);
    const fechaQueryFin = new Date(FFQ1);
    const fechainicio = new Date(FI1);
    const fechaFin = new Date(FF1);
    const condicion1 = fechaQueryInicio > fechainicio;
    const condicion2 = fechaQueryInicio > fechaFin;
    const condicion3 = fechaQueryFin > fechainicio;
    const condicion4 = fechaQueryFin > fechaQueryFin;
  
    let existeCruce = false;
    if (condicion1 === false && condicion2 === false && condicion3 === true && condicion4 === true) {
      existeCruce = true;
    }
    if (condicion1 === true && condicion2 === false) {
      existeCruce = true;
    }
    if (condicion1 === false && condicion2 === false && condicion3 === true) {
      existeCruce = true;
    }
    return existeCruce;
  }
  
  async function obtenerNombreDia(fecha) {
    const date = new Date(fecha);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const sDate = date.toLocaleDateString('en-EN', options).split(',')[0];
    const sDiaPrimeraLetraCapitalize =
      (await this.capitalizeFirstLetter(sDate)) + '(' + fecha.split('-')[2] + ')';
    return sDiaPrimeraLetraCapitalize; //weekday[index]
  }
  
  async function capitalizeFirstLetter(string) {
    let aDia = [];
    aDia['Monday'] = 'Lunes';
    aDia['Tuesday'] = 'Martes';
    aDia['Wednesday'] = 'Miércoles';
    aDia['Thursday'] = 'Jueves';
    aDia['Friday'] = 'Viernes';
    aDia['Saturday'] = 'Sábado';
    aDia['Sunday'] = 'Domingo';
    const sDia = string.charAt(0).toUpperCase() + string.slice(1);
    return aDia[sDia];
  }
  
  async function concatObjeto(obj1, obj2) {
    try {
      for (let name in obj2) {
        obj1[name] = obj2[name];
      }
      return obj1;
    } catch (error) {
      console.log(error);
      return obj1;
    }
  }
  
  async function pad(n, padString, length) {
    //Añadir ceros a la izquierda, length tamaño final que debe tener
    n = n.toString();
    while (n.length < length) {
      n = padString + n;
    }
    return n;
  }
  
  async function removeDuplicates(originalArray) {
    let modoriginalArray = originalArray;
    let newArray = [];
    for (let i in modoriginalArray) {
      let filterArray = newArray.filter(function (el) {
        return el == modoriginalArray[i];
      });
      if (filterArray.length == 0) {
        newArray.push(modoriginalArray[i]);
      }
    }
    return newArray;
  }
  
  async function generarDateJS(fecha) {
    let year = fecha.getFullYear();
    let month = ('0' + (fecha.getMonth() + 1)).slice(-2);
    let day = ('0' + fecha.getDate()).slice(-2);
    let hour = fecha.getHours();
    let minute = fecha.getMinutes();
    let seconds = fecha.getSeconds();
  
    // prints date & time in YYYY-MM-DD HH:MM:SS format
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds;
  }
  
  function formatDateIso(sDate) {
    let nuevaFecha;
    if (sDate) {
      let currentDate = new Date(sDate);
      currentDate.setMinutes(currentDate.getMinutes() - currentDate.getTimezoneOffset());
      nuevaFecha = currentDate.toISOString();
    } else {
      nuevaFecha = sDate;
    }
  
    return nuevaFecha;
  }
  
  module.exports = {
    sendResponse,
    customError,
    formatDate,
    generarDate,
    validarAuditRequest,
    convertEmptyToZero,
    generarCodigo,
    convertEmptyToVacio,
    convertEmptyToZeroFloat,
    existeValorCampo,
    existeValorCampoNumero,
    utf8_decode,
    utf8_encode,
    filterParamBD,
    decodeBase64,
    decodeUtf8,
    mensajeRangoFecha,
    customRequest,
    obtenerFechasHistorico,
    obtenetNumDiasEntreFechas,
    sumarDiaFecha,
    validarCruceHorario,
    validarCruceHorarioActivar,
    obtenerNombreDia,
    capitalizeFirstLetter,
    concatObjeto,
    pad,
    removeDuplicates,
    generarDateJS,
    formatDateIso,
  };
  