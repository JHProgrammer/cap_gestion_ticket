exports.obtenerRegBloquexEntidad = async (oParam) => {
    const results = await SELECT.from(oParam.entidad)
      // .columns(`[*]`)
      .where(oParam.filtroFinal)
      .limit(oParam.limit, (oParam.pagina - 1) * oParam.limit);
    return results;
  };
  
  exports.cantidadRegTotalesEntidad = async (oParam) => {
    const cantidadRegTotales = await SELECT.from(oParam.entidad)
      .columns(`count(*) as totalrows`)
      .where(oParam.filtroFinal);
    return cantidadRegTotales[0].totalrows;
  };
  
  exports.cantidadRegBloquesEntidad = (oParam) => {
    let bloques =
      Math.floor(oParam.totalrows / oParam.limit) +
      (oParam.totalrows % oParam.limit > 0 ? 1 : 0);
    return bloques;
  };
  
  exports.obtenerRegXEntidadXFiltro = async (oParam) => {
    const results = await SELECT.from(oParam.entidad)
      // .columns(`[*]`)
      .where(oParam.filtroFinal);
    return results;
  };
  