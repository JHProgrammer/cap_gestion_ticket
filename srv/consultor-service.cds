using seidor.tabla as tabla from '../db/schema';

@protocol: ['rest','odata-v4' ]
service ConsultorService @(path: 'serviceConsultor') {
    
    entity Consultor as projection on tabla.Consultor;
}
