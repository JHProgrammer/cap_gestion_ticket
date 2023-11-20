using seidor.tabla as tabla from '../db/schema';

using seidor.vista as vista from '../db/vistas';

using { types } from './types';

// @protocol: 'rest'
@protocol: ['rest','odata-v4' ]
service ClientService {
    
    @cds.redirection.target: true
    entity Cliente as projection on tabla.Cliente;


    entity LiderCliente as projection on tabla.LiderCliente;
    

    @readonly
    entity VCliente as projection on vista.VCliente
    actions {
        
        function obtenerClientexFiltro( jsonFiltro : types.object )  returns types.responseServices;
    };

    
}
