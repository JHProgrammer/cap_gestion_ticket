using seidor.tabla as tabla from '../db/schema';

@protocol: ['rest','odata-v4' ]
service LiderService @(path: 'liderService') {
    
    entity Lider as projection on tabla.Lider;

}
