exports.validarTexto = (oParam) => {
    let valid = false;
    if (oParam) {
      valid = true;
    }
    return valid;
  };
  
  exports.validarNumber = (oParam) => {
    var number = Number(oParam);
    return !Number.isNaN(number);
  };
  
  exports.validArray = (oParam) => {
    var isArray = Array.isArray(oParam);
    return isArray;
  };
  
  exports.validaUndefined = function (sCampo) {
    if (sCampo === undefined) {
      return false;
    }
    if (sCampo === null) {
      return false;
    }
    if (sCampo === "") {
      return false;
    }
    return true;
  };
  