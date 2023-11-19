using seidor.tabla as tabla from '../db/schema';

@protocol: ['rest','odata-v4' ]
service ConsultorService @(path: 'consultorService') {
    
    entity Consultor as projection on tabla.Consultor;
}
