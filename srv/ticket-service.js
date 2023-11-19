const cds = require('@sap/cds');

const utils = require('./utils/utils');
const textBundle = require('./utils/textBundle');

const { Ticket } = cds.entities('seidor.tabla');
const { } = cds.entities('seidor.vista');

module.exports = (srv) => { 

    srv.before("*", (req) => {
        console.log(`Method: ${req.method}`);
        console.log(`Target: ${req.target}`);
        console.log(req.user);
        console.log(req.user.is('authenticated-user'));
    });
    
    srv.on("CREATE", "Ticket", async (req) => {

        const  ticket = req.data;

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
                "FechaRegistro": ticket.FechaRegistro,
                "Periodo": ticket.Periodo,
                "NumTicket": ticket.NumTicket,
                "PrioridadTicket": ticket.PrioridadTicket,
                "to_Cliente_ID": ticket.to_Cliente_ID,
                "Descripcion": ticket.Descripcion,
                "Tipo": ticket.Tipo,
                "Estado": ticket.Estado,
                "DescEstado": ticket.DescEstado,
                "IdEstado": 1,
                "to_Consultor_ID": ticket.to_Consultor_ID,
                "to_Lider_ID": ticket.to_Lider_ID,
                "HoraEstimada": ticket.HoraEstimada,
                "FechaEnvioEst": ticket.FechaEnvioEst
              };

            await tx.run(INSERT.into(Ticket).entries(obj));
            //}

            await tx.commit();
            /******************* */
            oResponse.code = parseInt(bundle.getText('code.idf1'), 10);
            oResponse.message = bundle.getText('msj.idf1');
            oResponse.oDataResponse = {
                Ticket: obj
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