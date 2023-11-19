const cds = require('@sap/cds');
const utils = require('./utils/utils');
const textBundle = require('./utils/textBundle');


const { Cliente, LiderCliente } = cds.entities('seidor.tabla');
const { } = cds.entities('seidor.vista');

module.exports = (srv) => {

    srv.before("*", (req) => {
        console.log(`Method: ${req.method}`);
        console.log(`Target: ${req.target}`);
        console.log(req.user);
        console.log(req.user.is('authenticated-user'));
    });

    srv.before("CREATE","Cliente", async (req) =>{
        console.log("antes de crear",req.data);
    });

    srv.on("CREATE", "Cliente", async (req) => {

        const  cliente = req.data;

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
                "Nombre": cliente.Nombre,
                "Division": cliente.Division,
                "Gestor": cliente.Gestor,
                "Prioridad": cliente.Prioridad,
                "Frecuencia": cliente.Frecuencia,
                "Integracion": cliente.Integracion,
                "BTP": cliente.BTP
              };

            await tx.run(INSERT.into(Cliente).entries(obj));
            //}

            if(cliente.to_ClienteLider && cliente.to_ClienteLider.length > 0){
                let aLiderTicket = [];
                cliente.to_ClienteLider.forEach(element => {
                    let objLiderCliente = {
                        "to_Cliente_ID": obj.ID,
                        "to_Lider_ID": element.to_Lider_ID
                      }
                      aLiderTicket.push(objLiderCliente);
                });
                
                await tx.run(INSERT.into(LiderCliente).entries(aLiderTicket));
                //}
                
                console.log("Lider_ID",aLiderTicket);
            }
            await tx.commit();
            /******************* */
            oResponse.code = parseInt(bundle.getText('code.idf1'), 10);
            oResponse.message = bundle.getText('msj.idf1');
            oResponse.oDataResponse = {
                cliente: obj
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
