const cds = require('@sap/cds');
const xsenv = require('@sap/xsenv');

const passport = require('passport');
const xssec = require('@sap/xssec');
const cors = require('cors');

xsenv.loadEnv();

const xsuaa = xsenv.getServices({
    xsuaa: {
        name: 'cap_gestion_ticket-auth'
    }
}).xsuaa;

passport.use(new xssec.JWTStrategy(xsuaa));

cds.on("bootstrap", (app)=>{
    app.use(passport.initialize());
    app.use(cors())
    app.get("/alive", (_,res)=>{
        res.status(200).send("Server is alive");
    });
});

if (process.env.NODE_ENV !== 'production') {
    const cds_swagger = require ('cds-swagger-ui-express')
    cds.on ('bootstrap', app => app.use (cds_swagger()) )
}
