const cds = require('@sap/cds');
const env = require('@sap/xsenv');


cds.on("bootstrap", (app)=>{
    app.get("/alive", (_,res)=>{
        res.status(200).send("Server is alive");
    });
});

if (process.env.NODE_ENV !== 'production') {
    const cds_swagger = require ('cds-swagger-ui-express')
    cds.on ('bootstrap', app => app.use (cds_swagger()) )
}
