namespace seidor.vista;

using seidor.tabla as tabla from './schema';


entity VTicket as 
                Select from tabla.Ticket {
                    *
                };


entity VLideres as 
    Select from tabla.Lider {
    *
};


entity VConsultores as 
        Select from tabla.Consultor {
    *
} excluding  {
    createdAt,
    createdBy
};

entity VCliente as 
        select from tabla.Cliente {
            *
        }
excluding {
    createdAt,
    createdBy
};


