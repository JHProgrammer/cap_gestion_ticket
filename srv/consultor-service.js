const cds = require('@sap/cds');

const utils = require('./utils/utils');
const textBundle = require('./utils/textBundle');

const { Consultor } = cds.entities('seidor.tabla');
const { } = cds.entities('seidor.vista');

module.exports = (srv) => {

    srv.before("*", (req) => {
        console.log(`Method: ${req.method}`);
        console.log(`Target: ${req.target}`);
        console.log(req.user);
        console.log(req.user.is('authenticated-user'));
    });

    // srv.after("READ","Consultor", (req)=>{
    //     console.log("consultor read")
    // });

    srv.on("CREATE","Consultor", async (req)=> {
        const  consultor = req.data;
        const tx = cds.transaction();

        let oResponse = {};
        oResponse.oDataResponse = {};
        let locale;
        let bundle;
        let oRequest;
        try {
            oRequest = await utils.customRequest(req);
            locale = req.user.locale;
            bundle = textBundle.getTextBundle(locale);
            /******************* */

            let obj = {
                "Nombre": consultor.Nombre,
                "Puesto": consultor.Puesto
              };

            await tx.run(INSERT.into(Consultor).entries(obj));
            //}
            await tx.commit();

            /******************* */
            oResponse.code = parseInt(bundle.getText('code.idf1'), 10);
            oResponse.message = bundle.getText('msj.idf1');
            oResponse.oDataResponse = {
                consultor: obj
            };
        } catch (e) {
            const oError = await utils.customError(e, parseInt(bundle.getText('code.idt3'), 10));
            oResponse.code = oError.code;
            oResponse.message = oError.message;
        } finally {
            oResponse = utils.sendResponse(
                oRequest.oAuditRequest.idtransaccion,
                oResponse.code,
                oResponse.message,
                oResponse.oDataResponse
            );
        }
        return oResponse;
    });
};